<template>
  <ToolsToolWrapper v-if="toolComp && tool" :name="tool.name" :description="tool.description">
    <component :is="toolComp" :key="slug" />
  </ToolsToolWrapper>
  <div v-else class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <CommonAppCard>
      <p class="py-8 text-center text-gray-500 dark:text-gray-400">Tool not found</p>
    </CommonAppCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const tool = computed(() => findTool(slug.value))

const _glob = import.meta.glob('~/components/tools/**/*.vue', { eager: true })
const _pathToSlug: Record<string, string> = {
  'numbers/CoinFlip': 'coin-flip',
  'numbers/RandomNumber': 'random-number',
  'numbers/DiceRoller': 'dice-roller',
  'numbers/LotteryPicker': 'lottery',
  'numbers/RandomDate': 'random-date',
  'numbers/RandomTime': 'random-time',
  'pickers/NamePicker': 'name-picker',
  'pickers/SpinWheel': 'spin-wheel',
  'pickers/DecisionMaker': 'decision-maker',
  'pickers/YesNoOracle': 'yes-no-oracle',
  'groups/TeamGenerator': 'team-generator',
  'groups/GroupMaker': 'group-maker',
  'groups/RandomPairing': 'random-pairing',
  'groups/TournamentBracket': 'tournament-seeding',
  'strings/PasswordGenerator': 'password-generator',
  'strings/UUIDGenerator': 'uuid-generator',
  'strings/LoremIpsum': 'lorem-ipsum',
  'visual/ColorGenerator': 'color-generator',
  'visual/GradientGenerator': 'gradient-generator',
  'visual/IdenticonGen': 'identicon',
  'fun/JokeDisplay': 'random-joke',
  'fun/FactDisplay': 'random-fact',
  'fun/QuoteDisplay': 'random-quote',
  'interactive/SlotMachine': 'slot-machine',
  'interactive/BingoCard': 'bingo-card',
}

const slugToComp: Record<string, any> = {}
for (const [path, mod] of Object.entries(_glob)) {
  const key = path.replace(/^.*\/tools\//, '').replace(/\.vue$/, '')
  const s = _pathToSlug[key]
  if (s) slugToComp[s] = (mod as any).default
}

const toolComp = computed(() => {
  const s = slug.value
  return s ? slugToComp[s] : undefined
})
</script>

