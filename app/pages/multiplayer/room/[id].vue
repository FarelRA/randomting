<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <template v-if="!joined && !joining">
      <div class="mx-auto max-w-sm">
        <CommonAppCard>
          <h2 class="mb-4 text-xl font-bold">Join Room</h2>
          <p v-if="joinError" class="mb-4 text-sm text-red-500">{{ joinError }}</p>
          <CommonAppInput v-model="username" label="Your Name" placeholder="Enter your username" />
          <CommonAppButton class="mt-4 w-full" :disabled="!username.trim()" @click="handleJoin">
            Join Room
          </CommonAppButton>
        </CommonAppCard>
      </div>
    </template>

    <template v-else-if="room">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <NuxtLink to="/multiplayer" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            &larr; Back to Lobby
          </NuxtLink>
          <h1 class="mt-1 text-2xl font-bold">{{ room.name }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ toolLabel }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">
            {{ room.playerCount }}/{{ room.maxPlayers }} players
          </span>
          <button
            v-if="room.id"
            class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            @click="copyInviteLink"
          >
            {{ copied ? 'Copied!' : 'Copy Invite Link' }}
          </button>
        </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <CommonAppCard>
            <template v-if="room.status === 'waiting'">
              <MultiplayerRoomLobby
                :players="players"
                :host-id="room.hostId"
                :is-host="isHost"
                :my-id="you?.id"
                @ready="toggleReady"
                @start="startGame"
                @leave="handleLeave"
                @kick="handleKick"
              />
            </template>
            <template v-else>
              <MultiplayerSharedSpinWheel
                v-if="room.tool === 'spin-wheel'"
                :segments="wheelSegments"
                :is-host="isHost"
                :last-result="lastSpinResult"
                :spinning="spinning"
                @spin="handleSpin"
              />
              <MultiplayerDice
                v-else-if="room.tool === 'dice'"
                ref="diceRef"
                :player-name="you?.username || ''"
                @roll="handleDiceRoll"
              />
              <MultiplayerGroupLottery
                v-else-if="room.tool === 'lottery'"
                ref="lotteryRef"
                :is-host="isHost"
                :player-name="you?.username || ''"
                @add-entry="handleLotteryEntry"
                @draw="handleLotteryDraw"
                @reset="handleLotteryReset"
              />
              <MultiplayerRandomBattle
                v-else-if="room.tool === 'battle'"
                ref="battleRef"
                :players="players"
                :my-id="you?.id"
                @challenge="handleBattleChallenge"
                @reset="handleBattleReset"
              />
              <p v-else class="py-8 text-center text-gray-500">
                Unknown tool: {{ room.tool }}
              </p>

              <div v-if="room.status === 'playing'" class="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <CommonAppButton variant="ghost" class="text-red-500" @click="handleLeave">
                  Leave Room
                </CommonAppButton>
              </div>
            </template>
          </CommonAppCard>
        </div>

        <div>
          <CommonAppCard>
            <MultiplayerChatPanel
              :messages="chatMessages"
              :my-id="you?.id"
              @send="handleSendChat"
            />
          </CommonAppCard>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from '~/composables/useWebSocket'
import { useMultiplayer } from '~/composables/useMultiplayer'

const route = useRoute()
const roomId = computed(() => route.params.id as string)

const {
  room, players, you, isHost, joined, joining, joinError,
  chatMessages, lastToolResult, ws,
  join, leave, toggleReady, kickPlayer, sendChat, sendToolAction, resetToolResult,
} = useMultiplayer(roomId.value)

const username = ref('')
const copied = ref(false)
const spinning = ref(false)
const lastSpinResult = ref<string | null>(null)

const diceRef = ref<InstanceType<typeof MultiplayerDice> | null>(null)
const lotteryRef = ref<InstanceType<typeof GroupLottery> | null>(null)
const battleRef = ref<InstanceType<typeof RandomBattle> | null>(null)

const toolLabels: Record<string, string> = {
  'spin-wheel': 'Shared Spin Wheel',
  'dice': 'Multiplayer Dice',
  'lottery': 'Group Lottery',
  'battle': 'Random Battle',
}

const toolLabel = computed(() => {
  if (!room.value) return ''
  return toolLabels[room.value.tool] || room.value.tool
})

const wheelSegments = computed(() => {
  if (!room.value?.config?.segments || (room.value.config.segments as string[]).length === 0) {
    return ['Option 1', 'Option 2', 'Option 3', 'Option 4']
  }
  return room.value.config.segments as string[]
})

watch(lastToolResult, (result) => {
  if (!result) return
  const tool = room.value?.tool
  if (tool === 'spin-wheel' && result.action === 'spin') {
    spinning.value = false
    lastSpinResult.value = result.winner as string
  }
  if (tool === 'dice' && result.action === 'roll') {
    diceRef.value?.addRoll(
      result.userId as string,
      players.value.find(p => p.id === result.userId)?.username || 'Unknown',
      result.rolls as number[],
      result.total as number
    )
  }
  if (tool === 'lottery') {
    if (result.action === 'add-entry') {
      lotteryRef.value?.updateEntryCount(result.entryCount as number)
    }
    if (result.action === 'draw') {
      lotteryRef.value?.updateWinners(result.winners as any[])
    }
  }
  if (tool === 'battle' && result.action === 'challenge') {
    battleRef.value?.setResult(result)
  }
})

function handleJoin() {
  if (!username.value.trim()) return
  const authStore = useAuthStore()
  join(username.value.trim(), authStore.user?.id)
}

function handleLeave() {
  leave()
  navigateTo('/multiplayer')
}

function handleKick(userId: string) {
  kickPlayer(userId)
}

function handleSendChat(text: string) {
  sendChat(text)
}

function handleSpin() {
  spinning.value = true
  lastSpinResult.value = null
  sendToolAction('spin', { segments: wheelSegments.value, power: 5 })
}

function handleDiceRoll(count: number, sides: number) {
  sendToolAction('roll', { count, sides })
}

function handleLotteryEntry(entry: string) {
  sendToolAction('add-entry', { playerId: you.value?.id, playerName: you.value?.username, entry })
}

function handleLotteryDraw(count: number) {
  sendToolAction('draw', { count })
}

function handleLotteryReset() {
  sendToolAction('reset', {})
  lotteryRef.value?.reset()
}

function handleBattleChallenge(opponentId: string) {
  const me = players.value.find(p => p.id === you.value?.id)
  const opponent = players.value.find(p => p.id === opponentId)
  sendToolAction('challenge', {
    challengerId: you.value?.id,
    challengerName: me?.username,
    opponentId,
    opponentName: opponent?.username,
  })
}

function handleBattleReset() {
  resetToolResult()
}

function startGame() {
  if (!room.value) return
  room.value.status = 'playing'
  sendToolAction('start', {})
}

async function copyInviteLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback
  }
}
</script>
