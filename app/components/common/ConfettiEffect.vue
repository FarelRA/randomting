<template>
  <canvas v-if="active" ref="canvasRef" class="pointer-events-none fixed inset-0 z-50 h-full w-full" />
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const props = withDefaults(defineProps<{
  active?: boolean
  duration?: number
}>(), {
  active: false,
  duration: 3000,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let timeline: gsap.core.Timeline | null = null

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  el: gsap.core.Tween | null
}

const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

function launch() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles: Particle[] = []
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      el: null,
    })
  }

  timeline = gsap.timeline()
  timeline.to({}, {
    duration: props.duration / 1000,
    ease: 'none',
    onUpdate: function () {
      const progress = this.progress()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.vy += 0.1
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.opacity = Math.max(0, 1 - progress)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      }
    },
    onComplete: () => {
      if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    },
  })
}

watch(() => props.active, (val) => {
  if (val) {
    nextTick(launch)
  } else if (timeline) {
    timeline.kill()
    timeline = null
  }
})

onUnmounted(() => {
  if (timeline) {
    timeline.kill()
  }
})
</script>
