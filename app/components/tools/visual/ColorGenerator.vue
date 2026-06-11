<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <CommonAppSelect v-model="format" label="Format" :options="formatOptions" />
        <CommonAppInput v-model.number="count" label="Count" type="number" :min="1" :max="20" hint="1-20" />
      </div>
      <CommonAppButton @click="generate">
        Generate {{ count }} Color{{ count > 1 ? 's' : '' }}
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="result && result.length > 0" :copy-text="result?.join(', ')" :show-confetti="true" class="mt-6">
    <div class="space-y-3">
      <div v-for="(color, i) in result" :key="i" class="flex items-center gap-3">
        <div class="h-10 w-10 shrink-0 rounded-lg border dark:border-gray-600" :style="{ backgroundColor: color.hex }" />
        <span class="font-mono text-sm font-medium">{{ color.formatted }}</span>
      </div>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="color-generator" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const format = ref('hex')
const count = ref(5)
const result = ref<{ hex: string; formatted: string }[] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

const formatOptions = [
  { value: 'hex', label: 'Hex (#FF00AA)' },
  { value: 'rgb', label: 'RGB (rgb(255, 0, 170))' },
  { value: 'hsl', label: 'HSL (hsl(320, 100%, 50%))' },
]

function randomComponent(): number {
  return Math.floor(gen() * 256)
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0')
}

interface ColorResult {
  hex: string
  formatted: string
}

function generate() {
  const colors: ColorResult[] = []
  for (let i = 0; i < count.value; i++) {
    const r = randomComponent()
    const g = randomComponent()
    const b = randomComponent()
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
    let formatted = ''
    if (format.value === 'rgb') {
      formatted = `rgb(${r}, ${g}, ${b})`
    } else if (format.value === 'hsl') {
      const max = Math.max(r, g, b) / 255
      const min = Math.min(r, g, b) / 255
      const l = (max + min) / 2 * 100
      let h = 0
      let s = 0
      if (max !== min) {
        const d = max - min
        s = l > 50 ? d / (2 - max - min) * 100 : d / (max + min) * 100
        if (max === r / 255) h = ((g / 255 - b / 255) / d + (g / 255 < b / 255 ? 6 : 0)) * 60
        else if (max === g / 255) h = ((b / 255 - r / 255) / d + 2) * 60
        else h = ((r / 255 - g / 255) / d + 4) * 60
      }
      formatted = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
    } else {
      formatted = hex
    }
    colors.push({ hex, formatted })
  }
  result.value = colors
  historyRef.value?.add(colors.map(c => c.formatted).join(', '))
  celebrate()
}
</script>
