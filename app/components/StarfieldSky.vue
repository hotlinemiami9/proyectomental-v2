<script setup lang="ts">
type StarColor = readonly [number, number, number]

interface StarSprite {
  canvas: HTMLCanvasElement
  size: number
}

interface Star {
  x: number
  y: number
  sprite: StarSprite
  baseAlpha: number
  depth: number
  phase: number
  speed: number
  secondarySpeed: number
}

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const animated = ref(false)

const starColors: readonly StarColor[] = [
  [182, 207, 255],
  [215, 231, 255],
  [248, 250, 255],
  [255, 250, 234],
  [255, 229, 194],
  [255, 202, 157],
]

let context: CanvasRenderingContext2D | null = null
let staticLayer: HTMLCanvasElement | null = null
let stars: Star[] = []
let width = 0
let height = 0
let pixelRatio = 1
let animationFrame: number | null = null
let lastFrame = 0
let resizeObserver: ResizeObserver | null = null
let motionQuery: MediaQueryList | null = null

function createRandom(seed: number) {
  let value = seed

  return () => {
    value += 0x6d2b79f5
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

function rgba(color: StarColor, alpha: number) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
}

function createStarSprite(radius: number, color: StarColor, bright: boolean): StarSprite {
  const glowRadius = Math.max(4, radius * (bright ? 10 : 6))
  const size = Math.ceil(glowRadius * 2 + (bright ? 20 : 4))
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = size * scale
  canvas.height = size * scale

  const spriteContext = canvas.getContext('2d')
  if (!spriteContext) return { canvas, size }

  spriteContext.scale(scale, scale)
  const center = size / 2

  const halo = spriteContext.createRadialGradient(center, center, 0, center, center, glowRadius)
  halo.addColorStop(0, rgba(color, 0.5))
  halo.addColorStop(0.12, rgba(color, 0.24))
  halo.addColorStop(0.42, rgba(color, 0.055))
  halo.addColorStop(1, rgba(color, 0))
  spriteContext.fillStyle = halo
  spriteContext.fillRect(center - glowRadius, center - glowRadius, glowRadius * 2, glowRadius * 2)

  if (bright) {
    const spikeLength = glowRadius * 1.45
    const horizontal = spriteContext.createLinearGradient(
      center - spikeLength,
      center,
      center + spikeLength,
      center,
    )
    horizontal.addColorStop(0, rgba(color, 0))
    horizontal.addColorStop(0.42, rgba(color, 0.035))
    horizontal.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
    horizontal.addColorStop(0.58, rgba(color, 0.035))
    horizontal.addColorStop(1, rgba(color, 0))
    spriteContext.fillStyle = horizontal
    spriteContext.fillRect(center - spikeLength, center - 0.3, spikeLength * 2, 0.6)

    const vertical = spriteContext.createLinearGradient(
      center,
      center - spikeLength,
      center,
      center + spikeLength,
    )
    vertical.addColorStop(0, rgba(color, 0))
    vertical.addColorStop(0.42, rgba(color, 0.035))
    vertical.addColorStop(0.5, 'rgba(255, 255, 255, 0.42)')
    vertical.addColorStop(0.58, rgba(color, 0.035))
    vertical.addColorStop(1, rgba(color, 0))
    spriteContext.fillStyle = vertical
    spriteContext.fillRect(center - 0.3, center - spikeLength, 0.6, spikeLength * 2)
  }

  const coreRadius = Math.max(0.7, radius * 1.35)
  const core = spriteContext.createRadialGradient(center, center, 0, center, center, coreRadius)
  core.addColorStop(0, 'rgba(255, 255, 255, 1)')
  core.addColorStop(0.28, 'rgba(255, 255, 255, 0.95)')
  core.addColorStop(0.65, rgba(color, 0.85))
  core.addColorStop(1, rgba(color, 0))
  spriteContext.fillStyle = core
  spriteContext.fillRect(center - coreRadius, center - coreRadius, coreRadius * 2, coreRadius * 2)

  return { canvas, size }
}

function buildStaticLayer() {
  const layer = document.createElement('canvas')
  layer.width = Math.round(width * pixelRatio)
  layer.height = Math.round(height * pixelRatio)

  const layerContext = layer.getContext('2d')
  if (!layerContext) return null

  layerContext.scale(pixelRatio, pixelRatio)

  const night = layerContext.createLinearGradient(0, 0, 0, height)
  night.addColorStop(0, '#01020a')
  night.addColorStop(0.48, '#040611')
  night.addColorStop(1, '#070913')
  layerContext.fillStyle = night
  layerContext.fillRect(0, 0, width, height)

  const hazeRadius = Math.max(width, height) * 0.75
  const haze = layerContext.createRadialGradient(
    width * 0.18,
    height * 0.12,
    0,
    width * 0.18,
    height * 0.12,
    hazeRadius,
  )
  haze.addColorStop(0, 'rgba(70, 88, 150, 0.11)')
  haze.addColorStop(0.35, 'rgba(45, 54, 105, 0.045)')
  haze.addColorStop(1, 'rgba(4, 6, 17, 0)')
  layerContext.fillStyle = haze
  layerContext.fillRect(0, 0, width, height)

  const random = createRandom(0x51a7f13d)
  const dustCount = Math.min(1000, Math.max(260, Math.floor((width * height) / 5200)))

  for (let index = 0; index < dustCount; index += 1) {
    const x = random() * width
    const y = random() * height
    const radius = 0.18 + random() * 0.52
    const alpha = 0.08 + Math.pow(random(), 2) * 0.42
    const color = starColors[Math.floor(random() * starColors.length)] ?? starColors[2]!

    layerContext.fillStyle = rgba(color, alpha)
    layerContext.beginPath()
    layerContext.arc(x, y, radius, 0, Math.PI * 2)
    layerContext.fill()
  }

  return layer
}

function buildStars() {
  const random = createRandom(0x7ac19e42)
  const count = Math.min(340, Math.max(120, Math.floor((width * height) / 8200)))

  stars = Array.from({ length: count }, () => {
    const brightness = Math.pow(random(), 3.2)
    const radius = 0.32 + brightness * 1.75
    const color = starColors[Math.floor(random() * starColors.length)] ?? starColors[2]!
    const bright = radius > 1.22 && random() > 0.42

    return {
      x: random() * width,
      y: random() * height,
      sprite: createStarSprite(radius, color, bright),
      baseAlpha: 0.3 + brightness * 0.68,
      depth: 0.35 + random() * 0.6,
      phase: random() * Math.PI * 2,
      speed: 0.55 + random() * 1.45,
      secondarySpeed: 1.1 + random() * 2.2,
    }
  })
}

function render(time: number) {
  const canvas = canvasRef.value
  if (!canvas || !context || !staticLayer) return

  context.save()
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(staticLayer, 0, 0)
  context.restore()

  context.save()
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.globalCompositeOperation = 'screen'

  for (const star of stars) {
    const primary = 0.5 + 0.5 * Math.sin(time * star.speed + star.phase)
    const secondary = 0.5 + 0.5 * Math.sin(time * star.secondarySpeed + star.phase * 1.7)
    const pulse = primary * 0.78 + secondary * 0.22
    const alpha = star.baseAlpha * (1 - star.depth + star.depth * pulse)
    const halfSize = star.sprite.size / 2

    context.globalAlpha = alpha
    context.drawImage(
      star.sprite.canvas,
      star.x - halfSize,
      star.y - halfSize,
      star.sprite.size,
      star.sprite.size,
    )
  }

  context.restore()
}

function stop() {
  if (animationFrame !== null) cancelAnimationFrame(animationFrame)
  animationFrame = null
}

function tick(timestamp: number) {
  animationFrame = requestAnimationFrame(tick)
  if (timestamp - lastFrame < 1000 / 30) return

  lastFrame = timestamp
  render(timestamp / 1000)
}

function start() {
  if (animationFrame !== null || document.hidden || motionQuery?.matches) return
  lastFrame = 0
  animationFrame = requestAnimationFrame(tick)
}

function setupCanvas() {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas || !context) return

  const bounds = container.getBoundingClientRect()
  width = Math.max(1, Math.round(bounds.width))
  height = Math.max(1, Math.round(bounds.height))
  pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75)
  canvas.width = Math.round(width * pixelRatio)
  canvas.height = Math.round(height * pixelRatio)

  staticLayer = buildStaticLayer()
  buildStars()
  render(0)
}

function handleMotionChange() {
  animated.value = !motionQuery?.matches

  if (motionQuery?.matches) {
    stop()
    render(0)
  } else {
    start()
  }
}

function handleVisibilityChange() {
  if (document.hidden) stop()
  else start()
}

onMounted(() => {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  context = canvas.getContext('2d', { alpha: false })
  if (!context) return

  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  animated.value = !motionQuery.matches
  motionQuery.addEventListener('change', handleMotionChange)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  resizeObserver = new ResizeObserver(setupCanvas)
  resizeObserver.observe(container)
  setupCanvas()
  start()
})

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
  motionQuery?.removeEventListener('change', handleMotionChange)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div
    ref="containerRef"
    class="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <canvas ref="canvasRef" class="block size-full" data-starfield :data-animated="animated" />
  </div>
</template>
