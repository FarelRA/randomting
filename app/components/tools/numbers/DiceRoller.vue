<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <CommonAppInput v-model.number="diceCount" label="Number of Dice" type="number" :min="1" :max="100" hint="1-100" />
        <CommonAppSelect v-model="sides" label="Sides per Die" :options="sideOptions" />
      </div>
      <CommonAppButton @click="roll">
        Roll {{ diceCount }}d{{ sides }}
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="!!result" :copy-text="result?.rolls.join(', ')" :show-confetti="true" class="mt-6">
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <span v-for="(roll, i) in result?.rolls" :key="i" :ref="el => setDieRef(el as HTMLElement, i)" class="die inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 border-primary-200 bg-primary-50 text-lg font-bold text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300">
          {{ roll }}
        </span>
      </div>
      <p v-if="diceCount > 1" class="text-lg">
        Total: <span class="font-bold text-primary-600 dark:text-primary-400">{{ result?.total }}</span>
      </p>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="dice-roller" />
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const celebrate = inject('celebrate') as () => void

const diceCount = ref(2)
const sides = ref('6')
const result = ref<{ rolls: number[]; total: number } | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)
const dieRefs = ref<HTMLElement[]>([])

const { randomInt } = useSeededRandom()

useToolConfig({ diceCount, sides })

const sideOptions = [
  { value: '4', label: 'd4' },
  { value: '6', label: 'd6' },
  { value: '8', label: 'd8' },
  { value: '10', label: 'd10' },
  { value: '12', label: 'd12' },
  { value: '20', label: 'd20' },
  { value: '100', label: 'd100' },
]

function setDieRef(el: HTMLElement, i: number) {
  if (el) dieRefs.value[i] = el
}

function roll() {
  const s = parseInt(sides.value)
  const rolls: number[] = []
  for (let i = 0; i < diceCount.value; i++) {
    rolls.push(randomInt(1, s))
  }
  const total = rolls.reduce((a, b) => a + b, 0)
  result.value = { rolls, total }
  historyRef.value?.add(`${diceCount.value}d${s}: [${rolls.join(', ')}] = ${total}`)
  celebrate()

  nextTick(() => {
    dieRefs.value.forEach((die, i) => {
      if (!die) return
      gsap.fromTo(die,
        { rotation: -360 + Math.random() * 720, scale: 0, x: (Math.random() - 0.5) * 100, y: -50 },
        { rotation: 0, scale: 1, x: 0, y: 0, duration: 0.5, delay: i * 0.06, ease: 'back.out(1.7)' }
      )
    })
  })
}
</script>
