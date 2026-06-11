interface Player {
  id: string
  username: string
  ready: boolean
  joinedAt: number
}

interface RoomInfo {
  id: string
  name: string
  hostId: string
  tool: string
  config: Record<string, any>
  status: 'waiting' | 'playing' | 'finished'
  maxPlayers: number
  playerCount: number
  createdAt: number
  lastActivity: number
}

interface ChatMessage {
  userId: string
  username: string
  text: string
  timestamp: number
}

interface ToolResult {
  userId: string | null
  action: string
  [key: string]: any
}

export function useMultiplayer(roomId: string) {
  const ws = useWebSocket()
  const room = ref<RoomInfo | null>(null)
  const players = ref<Player[]>([])
  const you = ref<{ id: string; username: string } | null>(null)
  const chatMessages = ref<ChatMessage[]>([])
  const lastToolResult = ref<ToolResult | null>(null)
  const joined = ref(false)
  const joining = ref(false)
  const joinError = ref<string | null>(null)

  const isHost = computed(() => you.value?.id === room.value?.hostId)

  function join(username: string, userId?: string) {
    if (joined.value) return
    joining.value = true
    joinError.value = null

    ws.connect()
    ws.on('room:joined', (data: { room: RoomInfo; players: Player[]; you: { id: string; username: string } }) => {
      room.value = data.room
      players.value = data.players
      you.value = data.you
      joined.value = true
      joining.value = false
    })

    ws.on('player:joined', (data: { player: Player }) => {
      players.value = [...players.value, data.player]
    })

    ws.on('player:left', (data: { userId: string }) => {
      players.value = players.value.filter(p => p.id !== data.userId)
    })

    ws.on('player:ready', (data: { userId: string; ready: boolean }) => {
      players.value = players.value.map(p =>
        p.id === data.userId ? { ...p, ready: data.ready } : p
      )
    })

    ws.on('tool:result', (data: ToolResult) => {
      lastToolResult.value = data
    })

    ws.on('chat:message', (msg: ChatMessage) => {
      chatMessages.value = [...chatMessages.value, msg]
    })

    ws.on('room:update', (data: { room: RoomInfo }) => {
      room.value = data.room
    })

    ws.on('room:closed', (data: { reason: string }) => {
      joined.value = false
      room.value = null
      players.value = []
      chatMessages.value = []
      joinError.value = data.reason
    })

    ws.on('room:kicked', (data: { reason: string }) => {
      joined.value = false
      room.value = null
      players.value = []
      joinError.value = data.reason
    })

    ws.on('error', (data: { message: string }) => {
      joinError.value = data.message
      joining.value = false
    })

    ws.emit('room:join', { roomId, username, userId })
  }

  function leave() {
    ws.emit('room:leave')
    joined.value = false
    room.value = null
    players.value = []
    you.value = null
    chatMessages.value = []
    lastToolResult.value = null
    // Don't disconnect the socket - the plugin's handleLeave will clean up
  }

  function toggleReady() {
    ws.emit('player:ready')
  }

  function kickPlayer(userId: string) {
    ws.emit('player:kick', { userId })
  }

  function sendChat(text: string) {
    ws.emit('chat:message', { text })
  }

  function sendToolAction(action: string, data: any = {}) {
    ws.emit('tool:action', { action, data })
  }

  function resetToolResult() {
    lastToolResult.value = null
  }

  return {
    room,
    players,
    you,
    isHost,
    joined,
    joining,
    joinError,
    chatMessages,
    lastToolResult,
    ws,
    join,
    leave,
    toggleReady,
    kickPlayer,
    sendChat,
    sendToolAction,
    resetToolResult,
  }
}
