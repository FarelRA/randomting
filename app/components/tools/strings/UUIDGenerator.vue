<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <CommonAppSelect v-model="version" label="UUID Version" :options="versionOptions" />
        <CommonAppInput v-model.number="count" label="Count" type="number" :min="1" :max="100" hint="1-100" />
      </div>
      <CommonAppButton @click="generate">
        Generate {{ count }} UUID{{ count > 1 ? 's' : '' }}
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="result && result.length > 0" :copy-text="result?.join('\n')" :show-confetti="true" class="mt-6">
    <div class="space-y-1">
      <p v-for="(uuid, i) in result" :key="i" class="font-mono text-sm text-primary-600 dark:text-primary-400">{{ uuid }}</p>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="uuid-generator" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const version = ref('v4')
const count = ref(1)
const result = ref<string[] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

const versionOptions = [
  { value: 'v4', label: 'UUID v4 (random)' },
  { value: 'v7', label: 'UUID v7 (time-ordered)' },
]

function uuidV4(): string {
  const hex = '0123456789abcdef'
  let uuid = ''
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-'
    } else if (i === 14) {
      uuid += '4'
    } else if (i === 19) {
      uuid += hex[(Math.floor(gen() * 4) + 8)]
    } else {
      uuid += hex[Math.floor(gen() * 16)]
    }
  }
  return uuid
}

function uuidV7(): string {
  const timestamp = Date.now().toString(16).padStart(12, '0')
  const hex = '0123456789abcdef'
  let uuid = ''
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-'
    } else if (i < 8) {
      uuid += timestamp[i]
    } else if (i === 14) {
      uuid += '7'
    } else if (i === 19) {
      uuid += hex[(Math.floor(gen() * 4) + 8)]
    } else {
      uuid += hex[Math.floor(gen() * 16)]
    }
  }
  return uuid
}

function generate() {
  const uuids: string[] = []
  for (let i = 0; i < count.value; i++) {
    uuids.push(version.value === 'v4' ? uuidV4() : uuidV7())
  }
  result.value = uuids
  historyRef.value?.add(uuids[0])
  celebrate()
}
</script>
