import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { db, schema } from '../utils/db'
import { eq } from 'drizzle-orm'

interface PlayerState {
  id: string
  username: string
  ready: boolean
  socketId: string
  joinedAt: number
}

interface RoomState {
  id: string
  name: string
  hostId: string
  tool: string
  config: Record<string, any>
  status: 'waiting' | 'playing' | 'finished'
  maxPlayers: number
  players: Map<string, PlayerState>
  createdAt: number
  lastActivity: number
  toolState: Record<string, any>
}

const rooms = new Map<string, RoomState>()

const PORT = 3101
const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NUXT_PUBLIC_SOCKET_URL || '*',
    credentials: true,
  },
})

httpServer.listen(PORT)

globalThis.__io = io
globalThis.__rooms = rooms

function serializeRoom(r: RoomState) {
  return {
    id: r.id,
    name: r.name,
    hostId: r.hostId,
    tool: r.tool,
    config: r.config,
    status: r.status,
    maxPlayers: r.maxPlayers,
    playerCount: r.players.size,
    createdAt: r.createdAt,
    lastActivity: r.lastActivity,
  }
}

function serializePlayers(r: RoomState) {
  return Array.from(r.players.values()).map(p => ({
    id: p.id,
    username: p.username,
    ready: p.ready,
    joinedAt: p.joinedAt,
  }))
}

function processToolAction(roomState: RoomState, action: string, data: any) {
  switch (roomState.tool) {
    case 'spin-wheel': {
      if (action !== 'spin') return null
      const segments = data.segments || []
      if (segments.length === 0) return null
      const winnerIndex = Math.floor(Math.random() * segments.length)
      const winner = segments[winnerIndex]
      const segmentAngle = 360 / segments.length
      const targetAngle = 360 * (5 + Math.random() * 3) + winnerIndex * segmentAngle + segmentAngle / 2
      return { winner, winnerIndex, targetAngle }
    }
    case 'dice': {
      if (action !== 'roll') return null
      const count = data.count || 1
      const sides = data.sides || 6
      const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1)
      const total = rolls.reduce((a: number, b: number) => a + b, 0)
      return { rolls, total, count, sides }
    }
    case 'lottery': {
      if (action === 'add-entry') {
        if (!roomState.toolState) roomState.toolState = {}
        if (!roomState.toolState.entries) roomState.toolState.entries = []
        roomState.toolState.entries.push({ playerId: data.playerId, playerName: data.playerName, entry: data.entry })
        return { entryCount: roomState.toolState.entries.length }
      }
      if (action === 'draw') {
        if (!roomState.toolState?.entries) return { winners: [] }
        const count = Math.min(data.count || 1, roomState.toolState.entries.length)
        const shuffled = [...roomState.toolState.entries].sort(() => Math.random() - 0.5)
        const winners = shuffled.slice(0, count)
        return { winners, drawCount: count, totalEntries: roomState.toolState.entries.length }
      }
      if (action === 'reset') {
        roomState.toolState = {}
        return { reset: true }
      }
      return null
    }
    case 'battle': {
      if (action !== 'challenge') return null
      const { challengerId, challengerName, opponentId, opponentName } = data
      if (!opponentId) return null
      const challengerRoll = Math.random()
      const opponentRoll = Math.random()
      if (challengerRoll > opponentRoll) {
        return { winner: challengerId, winnerName: challengerName, loser: opponentId, loserName: opponentName }
      } else if (opponentRoll > challengerRoll) {
        return { winner: opponentId, winnerName: opponentName, loser: challengerId, loserName: challengerName }
      } else {
        return { draw: true, challenger: challengerId, opponent: opponentId, challengerName, opponentName }
      }
    }
    default:
      return null
  }
}

io.on('connection', (socket) => {
  let currentRoomId: string | null = null
  let currentPlayerId: string | null = null

  function removePlayerFromRoom() {
    if (!currentRoomId || !currentPlayerId) return
    const roomState = rooms.get(currentRoomId)
    if (roomState) {
      roomState.players.delete(currentPlayerId)
      roomState.lastActivity = Date.now()
      socket.to(currentRoomId).emit('player:left', { userId: currentPlayerId })
      if (roomState.players.size === 0) {
        setTimeout(() => {
          if (roomState.players.size === 0) {
            rooms.delete(currentRoomId!)
          }
        }, 120000)
      }
    }
    socket.leave(currentRoomId)
    currentRoomId = null
    currentPlayerId = null
  }

  socket.on('room:join', async (data: { roomId: string; username: string; userId?: string }) => {
    const { roomId, username, userId } = data
    if (!roomId || !username) {
      socket.emit('error', { message: 'roomId and username are required' })
      return
    }

    if (!rooms.has(roomId)) {
      const [room] = await db.select().from(schema.rooms).where(eq(schema.rooms.id, roomId))
      if (!room) {
        socket.emit('error', { message: 'Room not found' })
        return
      }
      rooms.set(roomId, {
        id: room.id,
        name: room.name,
        hostId: room.hostId,
        tool: room.tool,
        config: JSON.parse(room.config || '{}'),
        status: room.status as RoomState['status'],
        maxPlayers: room.maxPlayers,
        players: new Map(),
        createdAt: room.createdAt,
        lastActivity: Date.now(),
        toolState: {},
      })
    }

    const roomState = rooms.get(roomId)!
    if (roomState.players.size >= roomState.maxPlayers) {
      socket.emit('error', { message: 'Room is full' })
      return
    }

    const playerId = userId || crypto.randomUUID()
    const player: PlayerState = {
      id: playerId,
      username,
      ready: false,
      socketId: socket.id,
      joinedAt: Date.now(),
    }

    roomState.players.set(playerId, player)
    socket.join(roomId)
    currentRoomId = roomId
    currentPlayerId = playerId

    socket.emit('room:joined', {
      room: serializeRoom(roomState),
      players: serializePlayers(roomState),
      you: { id: playerId, username },
    })

    socket.to(roomId).emit('player:joined', {
      player: { id: playerId, username, ready: false },
    })
  })

  socket.on('room:leave', () => {
    removePlayerFromRoom()
  })

  socket.on('player:ready', () => {
    if (!currentRoomId || !currentPlayerId) return
    const roomState = rooms.get(currentRoomId)
    if (!roomState) return
    const player = roomState.players.get(currentPlayerId)
    if (!player) return
    player.ready = !player.ready
    roomState.lastActivity = Date.now()
    io.to(currentRoomId).emit('player:ready', { userId: currentPlayerId, ready: player.ready })
  })

  socket.on('player:kick', (data: { userId: string }) => {
    if (!currentRoomId || !currentPlayerId) return
    const roomState = rooms.get(currentRoomId)
    if (!roomState || roomState.hostId !== currentPlayerId) return
    const kicked = roomState.players.get(data.userId)
    if (!kicked) return
    roomState.players.delete(data.userId)
    const kickedSocket = io.sockets.sockets.get(kicked.socketId)
    if (kickedSocket) {
      kickedSocket.leave(currentRoomId)
      kickedSocket.emit('room:kicked', { reason: 'You were kicked by the host' })
    }
    io.to(currentRoomId).emit('player:left', { userId: data.userId })
  })

  socket.on('tool:action', (data: { action: string; data: any }) => {
    if (!currentRoomId) return
    const roomState = rooms.get(currentRoomId)
    if (!roomState) return
    roomState.lastActivity = Date.now()

    if (data.action === 'start') {
      roomState.status = 'playing'
      io.to(currentRoomId).emit('room:update', { room: serializeRoom(roomState) })
      return
    }

    const result = processToolAction(roomState, data.action, data.data)
    if (result) {
      io.to(currentRoomId).emit('tool:result', {
        userId: currentPlayerId,
        action: data.action,
        ...result,
      })
    }
  })

  socket.on('chat:message', (data: { text: string }) => {
    if (!currentRoomId || !currentPlayerId || !data.text) return
    const roomState = rooms.get(currentRoomId)
    if (!roomState) return
    const player = roomState.players.get(currentPlayerId)
    if (!player) return
    roomState.lastActivity = Date.now()
    io.to(currentRoomId).emit('chat:message', {
      userId: currentPlayerId,
      username: player.username,
      text: data.text.slice(0, 500),
      timestamp: Date.now(),
    })
  })

  socket.on('disconnect', () => {
    removePlayerFromRoom()
  })
})

setInterval(() => {
  const now = Date.now()
  const timeout = 30 * 60 * 1000
  for (const [id, room] of rooms) {
    if (now - room.lastActivity > timeout && room.players.size === 0) {
      io.to(id).emit('room:closed', { reason: 'Room closed due to inactivity' })
      rooms.delete(id)
    }
  }
}, 60000)

export default defineNitroPlugin(async () => {
  // Socket.IO server started in module scope above
})
