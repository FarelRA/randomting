import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null
let listeners: Array<{ event: string; handler: (...args: any[]) => void }> = []
const connected = ref(false)
const status = ref<'disconnected' | 'connecting' | 'connected' | 'reconnecting'>('disconnected')
const error = ref<string | null>(null)

export function useWebSocket() {
  function connect() {
    if (socket?.connected) return

    status.value = 'connecting'

    socket = io(undefined, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    socket.on('connect', () => {
      connected.value = true
      status.value = 'connected'
      error.value = null
    })

    socket.on('disconnect', () => {
      connected.value = false
      status.value = 'disconnected'
    })

    socket.on('connect_error', (err) => {
      error.value = err.message
      status.value = 'reconnecting'
    })

    socket.on('reconnect_attempt', () => {
      status.value = 'reconnecting'
    })

    socket.on('reconnect', () => {
      connected.value = true
      status.value = 'connected'
      error.value = null
    })

    for (const { event, handler } of listeners) {
      socket.on(event, handler)
    }
  }

  function disconnect() {
    if (!socket) return
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
    connected.value = false
    status.value = 'disconnected'
  }

  function on(event: string, handler: (...args: any[]) => void) {
    listeners.push({ event, handler })
    if (socket) {
      socket.on(event, handler)
    }
  }

  function off(event: string, handler?: (...args: any[]) => void) {
    listeners = listeners.filter(l => l.event !== event || (handler && l.handler !== handler))
    if (socket) {
      if (handler) {
        socket.off(event, handler)
      } else {
        socket.off(event)
      }
    }
  }

  function emit(event: string, ...args: any[]) {
    if (!socket?.connected) {
      error.value = 'Not connected'
      return
    }
    socket.emit(event, ...args)
  }

  function cleanup() {
    disconnect()
    listeners = []
  }

  return { connected, status, error, connect, disconnect, on, off, emit, cleanup }
}
