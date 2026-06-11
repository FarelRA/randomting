<template>
  <div class="text-center">
    <div class="mb-6">
      <h3 class="mb-4 text-lg font-semibold">⚔️ Random Battle Arena</h3>
      <p class="text-sm text-gray-500">Challenge another player to a random duel!</p>
    </div>

    <div v-if="!challenged" class="mb-6">
      <AppSelect v-model="selectedOpponent" :options="opponentOptions" placeholder="Select opponent" label="Opponent" />
      <AppButton class="mt-4" :disabled="!selectedOpponent" @click="challenge">
        Challenge!
      </AppButton>
    </div>
    <div v-else class="mb-6 text-sm text-amber-600 dark:text-amber-400">
      Challenge sent! Waiting for result...
    </div>

    <div v-if="battleResult" class="space-y-4 rounded-lg border p-6" :class="resultClass">
      <div v-if="battleResult.draw" class="text-lg font-bold">
        It's a Draw!
      </div>
      <div v-else>
        <p class="text-lg font-bold">{{ battleResult.winnerName }} Wins!</p>
        <p class="mt-1 text-sm text-gray-500">{{ battleResult.loserName }} loses</p>
      </div>
      <AppButton variant="secondary" @click="resetBattle">
        Challenge Again
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  players: Array<{ id: string; username: string }>
  myId: string | undefined
}>()

const emit = defineEmits<{
  challenge: [opponentId: string]
  reset: []
}>()

const selectedOpponent = ref('')
const challenged = ref(false)
const battleResult = ref<{ winner?: string; winnerName?: string; loser?: string; loserName?: string; draw?: boolean; challenger?: string; opponent?: string; challengerName?: string; opponentName?: string } | null>(null)

const opponents = computed(() => props.players.filter(p => p.id !== props.myId))

const opponentOptions = computed(() =>
  opponents.value.map(p => ({ value: p.id, label: p.username }))
)

const resultClass = computed(() => {
  if (!battleResult.value) return ''
  if (battleResult.value.draw) return 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
  return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
})

function challenge() {
  if (!selectedOpponent.value) return
  challenged.value = true
  const opponent = opponents.value.find(p => p.id === selectedOpponent.value)
  const me = props.players.find(p => p.id === props.myId)
  emit('challenge', selectedOpponent.value)
  selectedOpponent.value = ''
}

function resetBattle() {
  battleResult.value = null
  challenged.value = false
  emit('reset')
}

function setResult(result: any) {
  battleResult.value = result
  challenged.value = false
}

defineExpose({ setResult, resetBattle })
</script>
