export interface ToolDef {
  slug: string
  name: string
  description: string
}

export interface CategoryDef {
  name: string
  slug: string
  toolCount: number
  tools: ToolDef[]
}

export const categories: CategoryDef[] = [
  {
    name: 'Numbers',
    slug: 'numbers',
    toolCount: 6,
    tools: [
      { slug: 'random-number', name: 'RNG', description: 'Random number in a range, integers or decimals' },
      { slug: 'dice-roller', name: 'Dice Roller', description: 'Roll N dice with M sides each' },
      { slug: 'coin-flip', name: 'Coin Flip', description: 'Flip 1-100 coins with count and animation' },
      { slug: 'lottery', name: 'Lottery Picker', description: 'Pick X unique numbers from a range of Y' },
      { slug: 'random-date', name: 'Random Date', description: 'Pick a random date between two dates' },
      { slug: 'random-time', name: 'Random Time', description: 'Pick a random time between two times' },
    ],
  },
  {
    name: 'Pickers',
    slug: 'pickers',
    toolCount: 4,
    tools: [
      { slug: 'name-picker', name: 'Name Picker', description: 'Enter a list, pick one or multiple items' },
      { slug: 'spin-wheel', name: 'Spin Wheel', description: 'Canvas-based wheel of fortune' },
      { slug: 'decision-maker', name: 'Decision Maker', description: 'Get a random decision with flair' },
      { slug: 'yes-no-oracle', name: 'Yes/No Oracle', description: 'Classic yes/no/maybe answers' },
    ],
  },
  {
    name: 'Groups',
    slug: 'groups',
    toolCount: 4,
    tools: [
      { slug: 'team-generator', name: 'Team Generator', description: 'Split a list of names into N equal teams' },
      { slug: 'group-maker', name: 'Group Maker', description: 'Split a list into groups with custom sizes' },
      { slug: 'random-pairing', name: 'Random Pairing', description: 'Pair up items from one or two lists' },
      { slug: 'tournament-seeding', name: 'Tournament Seeding', description: 'Generate a random tournament bracket' },
    ],
  },
  {
    name: 'Strings',
    slug: 'strings',
    toolCount: 3,
    tools: [
      { slug: 'password-generator', name: 'Password Generator', description: 'Customizable length and character types' },
      { slug: 'uuid-generator', name: 'UUID Generator', description: 'Generate UUID v4 and v7, bulk mode' },
      { slug: 'lorem-ipsum', name: 'Lorem Ipsum', description: 'Generate lorem ipsum text' },
    ],
  },
  {
    name: 'Visual',
    slug: 'visual',
    toolCount: 3,
    tools: [
      { slug: 'color-generator', name: 'Color Generator', description: 'Random colors in hex, RGB, HSL formats' },
      { slug: 'gradient-generator', name: 'Gradient Generator', description: 'Random linear/radial gradients' },
      { slug: 'identicon', name: 'Identicon', description: 'Deterministic avatar generated from a string' },
    ],
  },
  {
    name: 'Fun',
    slug: 'fun',
    toolCount: 3,
    tools: [
      { slug: 'random-joke', name: 'Random Joke', description: 'Show a random joke from a curated database' },
      { slug: 'random-fact', name: 'Random Fact', description: 'Show a random interesting fact' },
      { slug: 'random-quote', name: 'Random Quote', description: 'Show a random quote with author' },
    ],
  },
  {
    name: 'Interactive',
    slug: 'interactive',
    toolCount: 2,
    tools: [
      { slug: 'slot-machine', name: 'Slot Machine', description: '3-reel slot machine with spin animation' },
      { slug: 'bingo-card', name: 'Bingo Card', description: 'Generate a random bingo card' },
    ],
  },
  {
    name: 'Multiplayer',
    slug: 'multiplayer',
    toolCount: 4,
    tools: [
      { slug: 'shared-spin-wheel', name: 'Shared Spin Wheel', description: 'Spin together in real-time' },
      { slug: 'multiplayer-dice', name: 'Multiplayer Dice', description: 'Roll dice together' },
      { slug: 'group-lottery', name: 'Group Lottery', description: 'Live lottery draw' },
      { slug: 'random-battle', name: 'Random Battle', description: '1v1 or team challenges' },
    ],
  },
]

export function findTool(slug: string): ToolDef | undefined {
  for (const cat of categories) {
    const tool = cat.tools.find(t => t.slug === slug)
    if (tool) return tool
  }
  return undefined
}
