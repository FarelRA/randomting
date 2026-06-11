<template>
  <AppCard>
    <div class="space-y-4">
      <AppInput v-model="inputText" label="Input Text" placeholder="Type anything to generate an avatar" />
      <AppButton :disabled="!inputText.trim()" @click="generate">
        Generate Identicon
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!generated" :show-confetti="true" class="mt-6">
    <div class="flex flex-col items-center gap-4">
      <canvas ref="canvasRef" :width="size" :height="size" class="rounded-xl border dark:border-gray-600" />
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="identicon" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const inputText = ref('')
const generated = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)
const size = 200
const cellSize = size / 10

function hashString(str: string): number[] {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  const nums: number[] = []
  for (let i = 0; i < 25; i++) {
    hash = ((hash << 5) - hash) + (hash >>> 16) + i
    hash |= 0
    nums.push(Math.abs(hash))
  }
  return nums
}

function generate() {
  generated.value = true
  historyRef.value?.add(inputText.value)
  nextTick(draw)
  celebrate()
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const nums = hashString(inputText.value)
  const hue1 = nums[0] % 360
  const hue2 = (nums[1] % 360 + 60) % 360
  const bgColor = `hsl(${hue1}, 60%, 50%)`
  const fgColor = `hsl(${hue2}, 55%, 45%)`

  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  const grid: boolean[][] = []
  for (let row = 0; row < 5; row++) {
    grid[row] = []
    for (let col = 0; col < 3; col++) {
      const idx = row * 3 + col
      grid[row][col] = nums[idx] % 2 === 0
    }
  }

  ctx.fillStyle = fgColor
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      if (grid[row][col]) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
        ctx.fillRect((9 - col) * cellSize, row * cellSize, cellSize, cellSize)
      }
    }
  }
}
</script>
