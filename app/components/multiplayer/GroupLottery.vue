<template>
  <div class="text-center">
    <div class="mb-6">
      <h3 class="mb-2 text-lg font-semibold">Lottery Pool</h3>
      <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ entryCount }}</p>
      <p class="text-sm text-gray-500">entries</p>
    </div>

    <div v-if="!entered" class="mb-6">
      <AppInput v-model="entryText" placeholder="Your entry (optional)" />
      <AppButton class="mt-2" :disabled="!canJoin" @click="joinPool">
        Join the Pool
      </AppButton>
    </div>
    <div v-else class="mb-6 text-sm text-green-600 dark:text-green-400">
      You're in the pool!
    </div>

    <div v-if="isHost && entryCount > 0" class="mb-6">
      <div class="mb-2 flex items-center justify-center gap-2">
        <AppInput v-model.number="drawCount" type="number" :min="1" :max="entryCount" label="Winners to draw" />
      </div>
      <AppButton variant="secondary" @click="draw">
        Draw {{ drawCount }} Winner{{ drawCount > 1 ? 's' : '' }}
      </AppButton>
      <AppButton variant="ghost" class="ml-2 text-red-500" @click="reset">
        Reset Pool
      </AppButton>
    </div>

    <div v-if="lastWinners.length > 0" class="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
      <h4 class="mb-2 font-semibold text-green-800 dark:text-green-300">Winners</h4>
      <ul class="space-y-1">
        <li v-for="(w, i) in lastWinners" :key="i" class="text-sm font-medium">
          {{ w.playerName || w.entry || `Entry #${i + 1}` }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isHost: boolean
  playerName: string
}>()

const emit = defineEmits<{
  addEntry: [entry: string]
  draw: [count: number]
  reset: []
}>()

const entryText = ref('')
const entered = ref(false)
const drawCount = ref(1)
const entryCount = ref(0)
const lastWinners = ref<Array<{ playerName?: string; entry?: string }>>([])
const canJoin = ref(true)

function joinPool() {
  entered.value = true
  canJoin.value = false
  emit('addEntry', entryText.value || props.playerName)
}

function draw() {
  emit('draw', drawCount.value)
}

function reset() {
  entryCount.value = 0
  lastWinners.value = []
  entered.value = false
  canJoin.value = true
  emit('reset')
}

function updateEntryCount(count: number) {
  entryCount.value = count
}

function updateWinners(winners: Array<{ playerName?: string; entry?: string }>) {
  lastWinners.value = winners
}

defineExpose({ updateEntryCount, updateWinners, reset: () => { entryCount.value = 0; lastWinners.value = []; entered.value = false; canJoin.value = true } })
</script>
