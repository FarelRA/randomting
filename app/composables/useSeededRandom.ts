function mulberry32(seed: number) {
  let s = seed | 0
  return function () {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function useSeededRandom(externalSeed?: number) {
  const seed = ref(externalSeed ?? Date.now())
  let generator = mulberry32(seed.value)

  function reset(newSeed?: number) {
    if (newSeed !== undefined) seed.value = newSeed
    generator = mulberry32(seed.value)
  }

  function gen(): number {
    return generator()
  }

  function randomInt(min: number, max: number): number {
    return Math.floor(gen() * (max - min + 1)) + min
  }

  function randomFloat(min: number, max: number, decimals = 2): number {
    const val = gen() * (max - min) + min
    return parseFloat(val.toFixed(decimals))
  }

  function shuffle<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(gen() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  function pick<T>(array: T[], count = 1): T[] {
    return shuffle(array).slice(0, count)
  }

  function pickUnique<T>(array: T[], count: number): T[] {
    return pick(array, Math.min(count, array.length))
  }

  function pickWeighted<T>(items: T[], weights: number[]): T {
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let r = gen() * totalWeight
    for (let i = 0; i < items.length; i++) {
      r -= weights[i]
      if (r <= 0) return items[i]
    }
    return items[items.length - 1]
  }

  return {
    seed: readonly(seed),
    gen,
    randomInt,
    randomFloat,
    shuffle,
    pick,
    pickUnique,
    pickWeighted,
    reset,
  }
}
