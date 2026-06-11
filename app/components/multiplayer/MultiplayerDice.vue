<template>
  <div class="text-center">
    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
      <div v-for="roll in allRolls" :key="roll.playerId" class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p class="text-sm font-medium">{{ roll.playerName }}</p>
        <div class="mt-2 flex flex-wrap justify-center gap-1">
          <span
            v-for="(die, i) in roll.rolls"
            :key="i"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-lg font-bold dark:border-gray-600 dark:bg-gray-700"
          >
            {{ die }}
          </span>
        </div>
        <p class="mt-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
          Total: {{ roll.total }}
        </p>
      </div>
    </div>

    <div class="mb-4 flex items-center justify-center gap-4">
      <AppSelect v-model="diceCount" :options="diceOptions" label="Dice" />
      <AppSelect v-model="diceSides" :options="sideOptions" label="Sides" />
    </div>

    <AppButton size="lg" :disabled="rolling" @click="roll">
      {{ rolling ? 'Rolling...' : 'Roll Dice' }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  playerName: string
}>()

const emit = defineEmits<{
  roll: [count: number, sides: number]
}>()

const diceCount = ref(2)
const diceSides = ref(6)
const rolling = ref(false)

const allRolls = ref<Array<{ playerId: string; playerName: string; rolls: number[]; total: number }>>([])

const diceOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
]

const sideOptions = [
  { value: '4', label: 'd4' },
  { value: '6', label: 'd6' },
  { value: '8', label: 'd8' },
  { value: '10', label: 'd10' },
  { value: '12', label: 'd12' },
  { value: '20', label: 'd20' },
]

function roll() {
  rolling.value = true
  emit('roll', parseInt(diceCount.value), parseInt(diceSides.value))
  setTimeout(() => { rolling.value = false }, 500)
}

function addRoll(playerId: string, playerName: string, rolls: number[], total: number) {
  const existing = allRolls.value.findIndex(r => r.playerId === playerId)
  if (existing >= 0) {
    allRolls.value[existing] = { playerId, playerName, rolls, total }
  } else {
    allRolls.value.push({ playerId, playerName, rolls, total })
  }
}

function clearRolls() {
  allRolls.value = []
}

defineExpose({ addRoll, clearRolls })
</script>
