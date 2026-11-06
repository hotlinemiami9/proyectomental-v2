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

interface SkyTheme {
  colors: readonly StarColor[]
  background: readonly [string, string, string]
  haze: readonly [string, string, string]
  dustAlpha: number
  density: number
  brightness: number
  speed: number
}

const SKY_THEME: SkyTheme = {
  colors: [
    [255, 244, 214],
    [255, 232, 183],
    [255, 218, 145],
    [255, 255, 246],
    [255, 198, 128],
    [255, 174, 112],
  ],
  background: ['#080601', '#120c04', '#1b1207'],
  haze: ['rgba(242, 212, 143, 0.14)', 'rgba(180, 117, 47, 0.055)', 'rgba(27, 18, 7, 0)'],
  dustAlpha: 1.05,
  density: 1.6,
  brightness: 1.15,
  speed: 1,
}

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const animated = ref(false)

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
  const glowRadius = Math.max(bright ? 6.5 : 2.2, radius * (bright ? 6.8 : 2.8))
  const spikeLength = bright ? glowRadius * 2.3 : 0
  const extent = Math.max(glowRadius, spikeLength)
  const size = Math.ceil(extent * 2 + 4)
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = size * scale
  canvas.height = size * scale

  const spriteContext = canvas.getContext('2d')
  if (!spriteContext) return { canvas, size }

  spriteContext.scale(scale, scale)
  const center = size / 2

  if (bright) {
    // A very faint halo keeps the star luminous without turning it into a bright disc.
    const halo = spriteContext.createRadialGradient(center, center, 0, center, center, glowRadius)
    halo.addColorStop(0, rgba(color, 0.26))
    halo.addColorStop(0.16, rgba(color, 0.12))
    halo.addColorStop(0.44, rgba(color, 0.03))
    halo.addColorStop(0.76, rgba(color, 0.004))
    halo.addColorStop(1, rgba(color, 0))
    spriteContext.fillStyle = halo
    spriteContext.fillRect(center - glowRadius, center - glowRadius, glowRadius * 2, glowRadius * 2)

    const spikeWidth = 0.9
    const horizontal = spriteContext.createLinearGradient(
      center - spikeLength,
      center,
      center + spikeLength,
      center,
    )
    horizontal.addColorStop(0, rgba(color, 0))
    horizontal.addColorStop(0.34, rgba(color, 0.04))
    horizontal.addColorStop(0.48, 'rgba(255, 255, 255, 0.84)')
    horizontal.addColorStop(0.52, 'rgba(255, 255, 255, 0.84)')
    horizontal.addColorStop(0.66, rgba(color, 0.04))
    horizontal.addColorStop(1, rgba(color, 0))
    spriteContext.fillStyle = horizontal
    spriteContext.fillRect(
      center - spikeLength,
      center - spikeWidth / 2,
      spikeLength * 2,
      spikeWidth,
    )

    const vertical = spriteContext.createLinearGradient(
      center,
      center - spikeLength,
      center,
      center + spikeLength,
    )
    vertical.addColorStop(0, rgba(color, 0))
    vertical.addColorStop(0.34, rgba(color, 0.04))
    vertical.addColorStop(0.48, 'rgba(255, 255, 255, 0.74)')
    vertical.addColorStop(0.52, 'rgba(255, 255, 255, 0.74)')
    vertical.addColorStop(0.66, rgba(color, 0.04))
    vertical.addColorStop(1, rgba(color, 0))
    spriteContext.fillStyle = vertical
    spriteContext.fillRect(
      center - spikeWidth / 2,
      center - spikeLength,
      spikeWidth,
      spikeLength * 2,
    )

    const diagonalLength = spikeLength * 0.55
    spriteContext.save()
    spriteContext.translate(center, center)
    spriteContext.rotate(Math.PI / 4)
    const diagonal = spriteContext.createLinearGradient(-diagonalLength, 0, diagonalLength, 0)
    diagonal.addColorStop(0, rgba(color, 0))
    diagonal.addColorStop(0.42, rgba(color, 0.08))
    diagonal.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)')
    diagonal.addColorStop(0.58, rgba(color, 0.08))
    diagonal.addColorStop(1, rgba(color, 0))
    spriteContext.fillStyle = diagonal
    spriteContext.fillRect(-diagonalLength, -0.28, diagonalLength * 2, 0.56)
    spriteContext.restore()

    // Bright stars keep a small point of light at the centre of the spikes.
    const coreRadius = Math.max(0.6, radius * 0.84)
    const core = spriteContext.createRadialGradient(center, center, 0, center, center, coreRadius)
    core.addColorStop(0, 'rgba(255, 255, 255, 1)')
    core.addColorStop(0.34, 'rgba(255, 255, 255, 0.98)')
    core.addColorStop(0.7, rgba(color, 0.78))
    core.addColorStop(1, rgba(color, 0))
    spriteContext.fillStyle = core
    spriteContext.fillRect(center - coreRadius, center - coreRadius, coreRadius * 2, coreRadius * 2)
  } else {
    // Soft stars have no cross: a smooth radial falloff avoids hard, square pixels.
    const soft = spriteContext.createRadialGradient(center, center, 0, center, center, glowRadius)
    soft.addColorStop(0, 'rgba(255, 255, 255, 0.98)')
    soft.addColorStop(0.18, rgba(color, 0.9))
    soft.addColorStop(0.42, rgba(color, 0.3))
    soft.addColorStop(0.7, rgba(color, 0.04))
    soft.addColorStop(1, rgba(color, 0))
    spriteContext.fillStyle = soft
    spriteContext.fillRect(center - glowRadius, center - glowRadius, glowRadius * 2, glowRadius * 2)
  }

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
  night.addColorStop(0, SKY_THEME.background[0])
  night.addColorStop(0.48, SKY_THEME.background[1])
  night.addColorStop(1, SKY_THEME.background[2])
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
  haze.addColorStop(0, SKY_THEME.haze[0])
  haze.addColorStop(0.35, SKY_THEME.haze[1])
  haze.addColorStop(1, SKY_THEME.haze[2])
  layerContext.fillStyle = haze
  layerContext.fillRect(0, 0, width, height)

  const random = createRandom(0x51a7f13d)
  const dustCount = Math.min(
    1600,
    Math.max(420, Math.floor(((width * height) / 4200) * SKY_THEME.density)),
  )

  for (let index = 0; index < dustCount; index += 1) {
    const x = random() * width
    const y = random() * height
    const radius = 0.32 + random() * 0.58
    const alpha = (0.08 + Math.pow(random(), 2) * 0.42) * SKY_THEME.dustAlpha
    const colors = SKY_THEME.colors
    const color = colors[Math.floor(random() * colors.length)] ?? colors[2]!

    layerContext.fillStyle = rgba(color, alpha)
    layerContext.beginPath()
    layerContext.arc(x, y, radius, 0, Math.PI * 2)
    layerContext.fill()
  }

  return layer
}

function buildStars() {
  const random = createRandom(0x7ac19e42)
  const count = Math.min(
    760,
    Math.max(180, Math.floor(((width * height) / 6200) * SKY_THEME.density)),
  )
  const heroCount = Math.min(4, Math.floor(count / 90))
  const colors = SKY_THEME.colors
  const margin = 12
  const minDistance = 16
  const minDistanceSquared = minDistance * minDistance
  const placed: Array<{ x: number; y: number }> = []
  const usableWidth = Math.max(1, width - margin * 2)
  const usableHeight = Math.max(1, height - margin * 2)

  function placeStar(): { x: number; y: number } | null {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const x = margin + random() * usableWidth
      const y = margin + random() * usableHeight
      const separated = placed.every((other) => {
        const dx = other.x - x
        const dy = other.y - y
        return dx * dx + dy * dy >= minDistanceSquared
      })

      if (separated) {
        const position = { x, y }
        placed.push(position)
        return position
      }
    }

    return null
  }

  stars = []

  for (let index = 0; index < count; index += 1) {
    const position = placeStar()
    if (!position) continue

    const hero = index < heroCount
    const brightness = hero ? 0.82 + random() * 0.18 : Math.pow(random(), 3)
    const radius = hero ? 1.5 + random() * 0.6 : 0.28 + brightness * 1.3
    const color = colors[Math.floor(random() * colors.length)] ?? colors[2]!
    const bright = hero || (radius > 0.85 && random() > 0.3)

    stars.push({
      ...position,
      sprite: createStarSprite(radius, color, bright),
      baseAlpha: (hero ? 1.15 : 0.58 + brightness * 0.48) * SKY_THEME.brightness,
      depth: hero ? 0.35 + random() * 0.15 : 0.8 + random() * 0.17,
      phase: random() * Math.PI * 2,
      speed: (0.09 + random() * 0.14) * SKY_THEME.speed,
      secondarySpeed: (0.05 + random() * 0.08) * SKY_THEME.speed,
    })
  }
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
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  for (const star of stars) {
    const primary = 0.5 + 0.5 * Math.sin(time * star.speed + star.phase)
    const secondary = 0.5 + 0.5 * Math.sin(time * star.secondarySpeed + star.phase * 1.7)
    const pulse = primary * 0.78 + secondary * 0.22
    const alpha = star.baseAlpha * (1 - star.depth + star.depth * pulse)
    const halfSize = star.sprite.size / 2

    context.globalAlpha = Math.min(1, alpha * SKY_THEME.brightness)
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
  const desiredPixelRatio = Math.min(Math.max(window.devicePixelRatio || 1, 2), 2)
  const maxPixelRatio = 4096 / Math.max(width, height)
  pixelRatio = Math.max(1, Math.min(desiredPixelRatio, maxPixelRatio))
  canvas.width = Math.round(width * pixelRatio)
  canvas.height = Math.round(height * pixelRatio)

  staticLayer = buildStaticLayer()
  buildStars()
  canvas.dataset.starCount = String(stars.length)
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
    data-sky="gold"
  >
    <canvas ref="canvasRef" class="block size-full" data-starfield :data-animated="animated" />
  </div>
</template>
