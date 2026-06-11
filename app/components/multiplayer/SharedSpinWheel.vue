<template>
  <div class="text-center">
    <div class="mb-6">
      <canvas ref="canvasRef" :width="canvasSize" :height="canvasSize" class="mx-auto rounded-full shadow-lg" />
    </div>

    <div v-if="!spinning" class="space-y-4">
      <div v-if="isHost">
        <CommonAppButton size="lg" @click="spin">
          Spin the Wheel
        </CommonAppButton>
      </div>
      <p v-else class="text-sm text-gray-500">Waiting for the host to spin...</p>
    </div>
    <div v-else class="space-y-2">
      <div class="mx-auto h-2 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      <p class="text-sm text-gray-500">Spinning...</p>
    </div>

    <div v-if="lastResult" class="mt-6 rounded-lg bg-primary-50 p-4 dark:bg-primary-900/20">
      <p class="text-lg font-bold">Result: {{ lastResult }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  segments: string[]
  isHost: boolean
  lastResult: string | null
  spinning: boolean
}>()

const emit = defineEmits<{
  spin: []
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasSize = 280

function drawWheel(highlightIndex?: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const segments = props.segments.length > 0 ? props.segments : ['Option 1', 'Option 2', 'Option 3', 'Option 4']
  const arc = (2 * Math.PI) / segments.length
  const radius = canvasSize / 2 - 10

  ctx.clearRect(0, 0, canvasSize, canvasSize)

  for (let i = 0; i < segments.length; i++) {
    const startAngle = i * arc
    const endAngle = startAngle + arc
    ctx.beginPath()
    ctx.moveTo(radius + 10, radius + 10)
    ctx.arc(radius + 10, radius + 10, radius, startAngle, endAngle)
    ctx.closePath()

    const hue = (i / segments.length) * 360
    if (highlightIndex !== undefined && i === highlightIndex) {
      ctx.fillStyle = `hsl(${hue}, 80%, 70%)`
    } else {
      ctx.fillStyle = `hsl(${hue}, 60%, 55%)`
    }
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#fff'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'right'
    const textAngle = startAngle + arc / 2
    const textRadius = radius * 0.7
    ctx.save()
    ctx.translate(radius + 10, radius + 10)
    ctx.rotate(textAngle)
    ctx.fillText(segments[i].slice(0, 12), textRadius - 5, 4)
    ctx.restore()
  }

  ctx.beginPath()
  ctx.arc(radius + 10, radius + 10, 12, 0, 2 * Math.PI)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.strokeStyle = '#ddd'
  ctx.lineWidth = 2
  ctx.stroke()
}

function spin() {
  emit('spin')
}

onMounted(() => drawWheel())
watch(() => props.segments, () => drawWheel(), { deep: true })
</script>
