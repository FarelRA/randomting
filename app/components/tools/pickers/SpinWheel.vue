<template>
  <AppCard>
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Segments (one per line)</label>
        <textarea v-model="segmentsText" rows="4" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Option 1&#10;Option 2&#10;Option 3" />
      </div>
      <div class="flex justify-center">
        <canvas ref="canvasRef" :width="canvasSize" :height="canvasSize" class="rounded-full shadow-lg" />
      </div>
      <div class="text-center">
        <AppButton :disabled="segments.length < 2" @click="spin">
          {{ spinning ? 'Spinning...' : 'Spin!' }}
        </AppButton>
      </div>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!winner" :copy-text="winner" :show-confetti="true" class="mt-6">
    <p class="text-center text-2xl font-bold text-primary-600 dark:text-primary-400">{{ winner }}</p>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="spin-wheel" />
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const celebrate = inject('celebrate') as () => void

const segmentsText = ref('Option 1\nOption 2\nOption 3\nOption 4')
const spinning = ref(false)
const winner = ref<string | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasSize = 300
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)
let currentRotation = 0

const { gen } = useSeededRandom()

const segmentColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
  '#f97316', '#84cc16', '#06b6d4', '#a855f7',
]

const segments = computed(() => {
  return segmentsText.value.split('\n').map(s => s.trim()).filter(Boolean)
})

function drawWheel(rotation: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cx = canvasSize / 2
  const cy = canvasSize / 2
  const r = canvasSize / 2 - 10
  const segs = segments.value
  const arc = (2 * Math.PI) / segs.length

  ctx.clearRect(0, 0, canvasSize, canvasSize)

  for (let i = 0; i < segs.length; i++) {
    const startAngle = rotation + i * arc
    const endAngle = startAngle + arc

    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = segmentColors[i % segmentColors.length]
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    const midAngle = startAngle + arc / 2
    const labelR = r * 0.65
    ctx.save()
    ctx.translate(cx + Math.cos(midAngle) * labelR, cy + Math.sin(midAngle) * labelR)
    ctx.rotate(midAngle + Math.PI / 2)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(segs[i].substring(0, 10), 0, 0)
    ctx.restore()
  }

  ctx.beginPath()
  ctx.arc(cx, cy, 12, 0, 2 * Math.PI)
  ctx.fillStyle = '#1f2937'
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.stroke()

  const pointerX = cx + Math.sin(-rotation) * (r + 8)
  const pointerY = cy - Math.cos(-rotation) * (r + 8)
  ctx.beginPath()
  ctx.moveTo(pointerX, pointerY)
  ctx.lineTo(cx - 6, cy - 6)
  ctx.lineTo(cx + 6, cy - 6)
  ctx.closePath()
  ctx.fillStyle = '#ef4444'
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 2
  ctx.stroke()
}

function spin() {
  if (spinning.value) return
  spinning.value = true
  winner.value = null

  const segs = segments.value
  const winIndex = Math.floor(gen() * segs.length)
  const arc = (2 * Math.PI) / segs.length
  const targetAngle = currentRotation + 2 * Math.PI * (5 + gen() * 5) + winIndex * arc
  const startRotation = currentRotation

  gsap.to({}, {
    duration: 3,
    ease: 'power4.out',
    onUpdate: function () {
      const progress = this.progress()
      const rot = startRotation + (targetAngle - startRotation) * progress
      drawWheel(rot)
    },
    onComplete: () => {
      currentRotation = targetAngle % (2 * Math.PI)
      spinning.value = false
      winner.value = segs[winIndex]
      historyRef.value?.add(winner.value)
      celebrate()
    },
  })
}

onMounted(() => {
  drawWheel(0)
})

watch(segmentsText, () => {
  nextTick(() => drawWheel(currentRotation))
})
</script>
