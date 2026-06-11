<template>
  <AppCard>
    <div class="space-y-4">
      <AppInput v-model.number="count" label="Number of Coins" type="number" :min="1" :max="100" hint="1-100" />
      <AppButton @click="flip">
        Flip {{ count }} Coin{{ count > 1 ? 's' : '' }}
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :copy-text="resultText" :show-confetti="true" class="mt-6">
    <div class="space-y-4">
      <div class="flex justify-center gap-8">
        <div class="text-center">
          <div ref="headsIconRef" class="mb-1 text-3xl">🦅</div>
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ result?.heads }}</div>
          <div class="text-sm text-gray-500">Heads</div>
        </div>
        <div class="text-center">
          <div ref="tailsIconRef" class="mb-1 text-3xl">🪙</div>
          <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ result?.tails }}</div>
          <div class="text-sm text-gray-500">Tails</div>
        </div>
      </div>
      <div v-if="count <= 20" class="flex flex-wrap justify-center gap-1">
        <span v-for="(coin, i) in result?.coins" :key="i" class="text-xl coin-item" :title="coin === 'H' ? 'Heads' : 'Tails'">
          {{ coin === 'H' ? '🦅' : '🪙' }}
        </span>
      </div>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="coin-flip" />
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const celebrate = inject('celebrate') as () => void

const count = ref(1)
const result = ref<{ heads: number; tails: number; coins: string[] } | null>(null)

useToolConfig({ count })
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)
const headsIconRef = ref<HTMLElement | null>(null)
const tailsIconRef = ref<HTMLElement | null>(null)

const { gen } = useSeededRandom()

const resultText = computed(() => {
  if (!result.value) return ''
  return `${result.value.heads}H / ${result.value.tails}T`
})

function flip() {
  const coins: string[] = []
  let heads = 0
  let tails = 0
  for (let i = 0; i < count.value; i++) {
    if (gen() < 0.5) {
      coins.push('H')
      heads++
    } else {
      coins.push('T')
      tails++
    }
  }
  result.value = { heads, tails, coins }
  historyRef.value?.add(resultText.value)
  celebrate()

  nextTick(() => {
    if (headsIconRef.value) {
      gsap.fromTo(headsIconRef.value, { rotationY: 0 }, { rotationY: 360, duration: 0.6, ease: 'power2.out' })
    }
    if (tailsIconRef.value) {
      gsap.fromTo(tailsIconRef.value, { rotationY: 0 }, { rotationY: 360, duration: 0.6, ease: 'power2.out', delay: 0.1 })
    }
    const coins = document.querySelectorAll('.coin-item')
    coins.forEach((c, i) => {
      gsap.fromTo(c, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.4, delay: 0.2 + i * 0.03, ease: 'back.out(1.7)' })
    })
  })
}
</script>
