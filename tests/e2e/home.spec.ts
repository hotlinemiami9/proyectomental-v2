import { expect, test } from '@playwright/test'

test('renders the application shell', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tu carta')
  await expect(page.getByLabel('Nombre')).toBeVisible()
})

test('exposes a healthy service endpoint', async ({ request }) => {
  const response = await request.get('/api/health')

  expect(response.ok()).toBeTruthy()
  expect(await response.json()).toMatchObject({
    status: 'ok',
    service: 'proyectomental-v2',
  })
})

test('calculates, saves and opens a chart', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-hydrated="true"]').waitFor()

  await page.locator('#birth-name').fill('Prueba E2E')
  await page.locator('#birth-date').fill('1990-05-15')
  await page.locator('#birth-time').fill('14:30')
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.getByLabel('Ciudad de nacimiento').fill('Madrid')
  await page
    .getByRole('button', { name: /Madrid/ })
    .first()
    .click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByRole('button', { name: 'Calcular mi carta' }).click()

  await expect(page).toHaveURL(/\/carta\//)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prueba E2E')
  await expect(page.getByRole('img', { name: /BodyGraph/ })).toBeVisible()
  await expect(page.getByText('Estrategia')).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PNG' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toContain('prueba-e2e')

  const pdfPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PDF' }).click()
  const pdf = await pdfPromise
  expect(pdf.suggestedFilename()).toContain('prueba-e2e')

  await page.getByRole('link', { name: 'Mis cartas' }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mis cartas')
  await expect(page.getByText('Prueba E2E')).toBeVisible()
})
