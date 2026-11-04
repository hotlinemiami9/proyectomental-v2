import { jsPDF } from 'jspdf'
import type { ChartData } from '~/types/chart'
import { centerLabels, getChannelName } from '~/data/chart-labels'
import {
  centerContent,
  getAuthorityContent,
  getProfileContent,
  getTypeContent,
} from '~/data/interpretations'

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN = 14
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const DARK = [7, 9, 19] as const
const MOON = [247, 242, 232] as const
const MUTED = [157, 147, 133] as const
const GOLD = [242, 212, 143] as const

function download(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

function safeFilename(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60)
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No se pudo preparar la imagen.'))
    image.src = src
  })
}

async function svgToPng(svg: SVGSVGElement, scale = 2) {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const viewBox = svg.viewBox.baseVal
  const width = viewBox.width || svg.clientWidth || 820
  const height = viewBox.height || svg.clientHeight || 900

  const serialized = new XMLSerializer().serializeToString(clone)
  const image = await loadImage(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`,
  )

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('No se pudo preparar el lienzo de exportación.')

  context.fillStyle = '#070913'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/png')
}

function paintPage(pdf: jsPDF) {
  pdf.setFillColor(...DARK)
  pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F')
}

function formatBirthDate(value: string) {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export async function exportElementAsPng(element: HTMLElement, name: string) {
  const svg = element.querySelector('svg')
  if (!svg) throw new Error('No se encontró el BodyGraph para exportar.')

  download(await svgToPng(svg), `${safeFilename(name) || 'carta'}.png`)
}

export async function exportElementAsPdf(element: HTMLElement, chart: ChartData, name: string) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = MARGIN

  paintPage(pdf)

  const addPage = () => {
    pdf.addPage()
    paintPage(pdf)
    y = MARGIN
  }

  const ensureSpace = (height: number) => {
    if (y + height > PAGE_HEIGHT - MARGIN) addPage()
  }

  const heading = (text: string, size = 15) => {
    ensureSpace(size * 0.7 + 6)
    pdf.setFont('times', 'bold')
    pdf.setFontSize(size)
    pdf.setTextColor(...MOON)
    pdf.text(text, MARGIN, y)
    y += size * 0.55 + 4
  }

  const label = (text: string) => {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7)
    pdf.setTextColor(...GOLD)
    pdf.text(text.toUpperCase(), MARGIN, y)
    y += 4
  }

  const body = (text: string, size = 9, lineHeight = 4.5) => {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(size)
    pdf.setTextColor(...MUTED)

    for (const paragraph of text.split('\n')) {
      const lines = pdf.splitTextToSize(paragraph, CONTENT_WIDTH)
      for (const line of lines) {
        ensureSpace(lineHeight)
        pdf.text(line, MARGIN, y)
        y += lineHeight
      }
    }

    y += 3
  }

  const section = (title: string, text: string) => {
    heading(title, 13)
    body(text)
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7)
  pdf.setTextColor(...GOLD)
  pdf.text('PROYECTOMENTAL · CARTA DE DISEÑO HUMANO', MARGIN, y)
  y += 8

  pdf.setFont('times', 'bold')
  pdf.setFontSize(24)
  pdf.setTextColor(...MOON)
  const nameLines = pdf.splitTextToSize(chart.input.name, CONTENT_WIDTH)
  for (const line of nameLines) {
    pdf.text(line, MARGIN, y)
    y += 9
  }

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8.5)
  pdf.setTextColor(...MUTED)
  pdf.text(
    `${formatBirthDate(chart.input.date)} · ${chart.input.time} h · ${chart.input.city}, ${chart.input.country}`,
    MARGIN,
    y,
  )
  y += 7

  const svg = element.querySelector('svg')
  if (svg) {
    const chartImage = await svgToPng(svg, 1.5)
    const chartWidth = 160
    const chartHeight = (chartWidth * 900) / 820
    const chartX = (PAGE_WIDTH - chartWidth) / 2
    ensureSpace(chartHeight + 4)
    pdf.addImage(chartImage, 'PNG', chartX, y, chartWidth, chartHeight)
    y += chartHeight + 5
  }

  const summary: Array<[string, string]> = [
    ['Tipo', chart.summary.typeLabel],
    ['Estrategia', chart.summary.strategyLabel],
    ['Autoridad', chart.summary.authorityLabel],
    ['Perfil', chart.summary.profile],
    ['Definición', chart.summary.definitionLabel],
  ]

  for (const [key, value] of summary) {
    ensureSpace(6)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7)
    pdf.setTextColor(...GOLD)
    pdf.text(key.toUpperCase(), MARGIN, y)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(...MOON)
    pdf.text(value, MARGIN + 34, y)
    y += 6
  }

  addPage()
  heading('Lectura esencial', 18)
  section(
    'Tu tipo',
    `${getTypeContent(chart.summary.type).title}\n\n${getTypeContent(chart.summary.type).body}`,
  )
  section(
    'Tu autoridad',
    `${getAuthorityContent(chart.summary.authority).title}\n\n${getAuthorityContent(chart.summary.authority).body}`,
  )
  section(
    'Tu perfil',
    `${getProfileContent(chart.summary.profile).title}\n\n${getProfileContent(chart.summary.profile).body}`,
  )

  heading('Centros', 15)
  for (const center of chart.centers) {
    const content = centerContent[center.id]
    label(`${center.label} · ${center.defined ? 'Definido' : 'Abierto'}`)
    body(content.body, 8.5, 4.2)
  }

  heading('Canales activos', 15)
  const activeChannels = chart.channels.filter((channel) => channel.defined)
  if (activeChannels.length) {
    body(
      activeChannels
        .map(
          (channel) =>
            `Canal ${channel.key} · ${getChannelName(channel.key, channel.name)} (${centerLabels[channel.centers[0]]} ↔ ${centerLabels[channel.centers[1]]})`,
        )
        .join('\n'),
      8.5,
      4.5,
    )
  } else {
    body('No hay canales completos activos en esta carta.')
  }

  heading('Puertas activas', 15)
  body(chart.gates.map((gate) => gate.gate).join(' · '), 9, 4.5)

  ensureSpace(12)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7)
  pdf.setTextColor(...MUTED)
  pdf.text(
    'Esta lectura es una invitación a la autoobservación, no una descripción definitiva ni una recomendación médica, psicológica o financiera.',
    MARGIN,
    y,
    { maxWidth: CONTENT_WIDTH },
  )

  pdf.save(`${safeFilename(name) || 'carta'}.pdf`)
}
