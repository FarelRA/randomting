<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <CommonAppSelect v-model="gradientType" label="Type" :options="typeOptions" />
        <CommonAppSelect v-model="colorCount" label="Colors" :options="colorCountOptions" />
      </div>
      <CommonAppButton @click="generate">
        Generate Gradient
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="!!css" :copy-text="css" :show-confetti="true" class="mt-6">
    <div class="space-y-4">
      <div class="h-32 rounded-xl" :style="{ background: css }" />
      <p class="font-mono text-xs text-gray-500 dark:text-gray-400">{{ css }}</p>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="gradient-generator" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const gradientType = ref('linear')
const colorCount = ref('3')
const css = ref<string | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

const typeOptions = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
]

const colorCountOptions = [
  { value: '2', label: '2 colors' },
  { value: '3', label: '3 colors' },
  { value: '4', label: '4 colors' },
  { value: '5', label: '5 colors' },
]

function randomColor(): string {
  const r = Math.floor(gen() * 256)
  const g = Math.floor(gen() * 256)
  const b = Math.floor(gen() * 256)
  return `rgb(${r}, ${g}, ${b})`
}

function randomAngle(): number {
  return Math.floor(gen() * 360)
}

function generate() {
  const colors: string[] = []
  for (let i = 0; i < parseInt(colorCount.value); i++) {
    colors.push(randomColor())
  }

  if (gradientType.value === 'linear') {
    css.value = `linear-gradient(${randomAngle()}deg, ${colors.join(', ')})`
  } else {
    css.value = `radial-gradient(circle, ${colors.join(', ')})`
  }
  historyRef.value?.add(css.value)
  celebrate()
}
</script>
