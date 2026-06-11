<template>
  <CommonAppCard>
    <div class="space-y-4">
      <CommonAppButton :disabled="spinning" @click="spin">
        {{ spinning ? 'Spinning...' : 'Spin!' }}
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <div class="mt-6 flex justify-center gap-2">
    <div v-for="(reel, i) in reels" :key="i" :ref="el => reelRefs[i] = el as HTMLElement" class="flex h-28 w-24 items-center justify-center overflow-hidden rounded-xl border-2 bg-gray-50 text-5xl shadow-inner dark:border-gray-600 dark:bg-gray-800">
      <span class="font-bold" :class="winClass">{{ reel }}</span>
    </div>
  </div>

  <ToolsResultDisplay :visible="!!resultText" :copy-text="resultText || undefined" :show-confetti="isWin" class="mt-6">
    <p v-if="isWin" class="text-center text-2xl font-bold text-yellow-500">You Win!</p>
    <p v-else-if="resultText" class="text-center text-lg text-gray-500 dark:text-gray-400">{{ resultText }}</p>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="slot-machine" />
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const celebrate = inject('celebrate') as () => void

const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐', '🔔']
const reels = ref(['🍒', '🍒', '🍒'])
const spinning = ref(false)
const isWin = ref(false)
const resultText = ref<string | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)
const reelRefs = ref<HTMLElement[]>([])

const { pick } = useSeededRandom()

const winClass = computed(() => isWin.value ? 'text-yellow-500 drop-shadow-glow' : 'text-gray-700 dark:text-gray-300')

function spin() {
  if (spinning.value) return
  spinning.value = true
  isWin.value = false
  resultText.value = null

  const results = pick(symbols, 3)
  const timings = [0.3, 0.5, 0.7]

  results.forEach((symbol, i) => {
    const el = reelRefs.value[i]
    if (!el) return

    gsap.to(el.querySelector('span'), {
      y: -60,
      opacity: 0,
      duration: 0.15,
      delay: timings[i],
      ease: 'power2.in',
      onComplete: () => {
        reels.value[i] = symbol
        gsap.fromTo(el.querySelector('span'),
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.2, ease: 'back.out(2)' }
        )
      },
    })
  })

  const lastDelay = Math.max(...timings)
  setTimeout(() => {
    spinning.value = false
    const [a, b, c] = reels.value
    if (a === b && b === c) {
      isWin.value = true
      resultText.value = `${a} ${b} ${c} — Jackpot!`
      celebrate()
    } else if (a === b || b === c || a === c) {
      resultText.value = `${a} ${b} ${c} — Almost!`
    } else {
      resultText.value = `${a} ${b} ${c} — Try again`
    }
    historyRef.value?.add(resultText.value)
  }, Math.round(lastDelay * 1000) + 400)
}

onMounted(() => {
  reels.value = pick(symbols, 3)
})
</script>

<style scoped>
.drop-shadow-glow {
  filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.6));
}
</style>
