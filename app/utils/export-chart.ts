import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

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

export async function exportElementAsPng(element: HTMLElement, name: string) {
  const dataUrl = await toPng(element, {
    backgroundColor: '#070913',
    pixelRatio: 2,
    cacheBust: true,
  })
  download(dataUrl, `${safeFilename(name) || 'carta'}.png`)
}

export async function exportElementAsPdf(element: HTMLElement, name: string) {
  const dataUrl = await toPng(element, {
    backgroundColor: '#070913',
    pixelRatio: 2,
    cacheBust: true,
  })

  const image = new Image()
  image.src = dataUrl
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error('No se pudo preparar el PDF.'))
  })

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const margin = 10
  const pageWidth = 210
  const pageHeight = 297
  const imageWidth = pageWidth - margin * 2
  const imageHeight = (image.height * imageWidth) / image.width
  let heightLeft = imageHeight
  let position = margin

  pdf.addImage(dataUrl, 'PNG', margin, position, imageWidth, imageHeight)
  heightLeft -= pageHeight - margin * 2

  while (heightLeft > 0) {
    pdf.addPage()
    position -= pageHeight - margin * 2
    pdf.addImage(dataUrl, 'PNG', margin, position, imageWidth, imageHeight)
    heightLeft -= pageHeight - margin * 2
  }

  pdf.save(`${safeFilename(name) || 'carta'}.pdf`)
}
