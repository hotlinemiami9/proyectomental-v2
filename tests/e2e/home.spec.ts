import { expect, test } from '@playwright/test'

test('renders the application shell', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-hydrated="true"]').waitFor()

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Proyecto mental')
  await expect(page.getByLabel('Nombre')).toBeVisible()
  await expect(page.getByText('La hora debe ser exacta')).toBeVisible()
  await expect(page.getByLabel('Fecha de nacimiento')).toHaveAttribute('placeholder', 'DD/MM/AAAA')
  await expect(page.getByLabel(/Hora de nacimiento/)).toHaveAttribute('placeholder', 'HH:MM')
  await expect(page.getByRole('button', { name: 'Continuar' })).toHaveCount(0)
  await expect(page.locator('[data-starfield]')).toBeVisible()
  await expect(page.locator('[data-starfield]')).toHaveAttribute('data-animated', 'true')
})

test('keeps the sky static when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('[data-hydrated="true"]').waitFor()

  await expect(page.locator('[data-starfield]')).toBeVisible()
  await expect(page.locator('[data-starfield]')).toHaveAttribute('data-animated', 'false')
})

test('uses the final nocturnal landing style', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-hydrated="true"]').waitFor()

  await expect(page.locator('[data-sky="gold"]')).toBeVisible()
  await expect(page.locator('[data-starfield]')).toHaveAttribute(
    'data-star-count',
    /^([2-9]\d{2}|\d{4,})$/,
  )
  await expect(page.locator('[data-landing-style-bar]')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('para mentes inquietas')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /Fraunces/)
  await expect(page.getByLabel('Nombre')).toHaveCSS('font-family', /Manrope/)
})

test('keeps the form layout stable for errors and city results', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-hydrated="true"]').waitFor()

  const submit = page.getByRole('button', { name: 'Calcular mi carta' })
  const documentTop = () =>
    submit.evaluate((element) => element.getBoundingClientRect().top + window.scrollY)
  const initial = await documentTop()

  await submit.click()
  await expect(page.getByText('Escribe el nombre que aparecerá en la carta.')).toBeVisible()
  const withErrors = await documentTop()

  await page.getByLabel('Ciudad de nacimiento').fill('Madrid')
  await page
    .getByRole('option', { name: /Madrid/ })
    .first()
    .waitFor()
  const withResults = await documentTop()

  expect(Math.abs(withErrors - initial)).toBeLessThan(1)
  expect(Math.abs(withResults - initial)).toBeLessThan(1)
})

test('exposes a healthy service endpoint', async ({ request }) => {
  const response = await request.get('/api/health')

  expect(response.ok()).toBeTruthy()
  expect(await response.json()).toMatchObject({
    status: 'ok',
    service: 'proyectomental-v2',
  })
})

test('finds small municipalities in the offline city index', async ({ request }) => {
  const response = await request.get('/api/locations?q=Alcoy')

  expect(response.ok()).toBeTruthy()
  const body = (await response.json()) as {
    results: Array<{ city: string; country: string; timezone: string }>
  }

  expect(body.results).toContainEqual(
    expect.objectContaining({
      city: 'Alcoy',
      country: 'España',
      timezone: 'Europe/Madrid',
    }),
  )
})

test('calculates, saves and opens a chart', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-hydrated="true"]').waitFor()

  await page.locator('#birth-name').fill('Prueba E2E')
  await page.locator('#birth-date').fill('15/05/1990')
  await page.locator('#birth-time').fill('14:30')
  await expect(page.locator('#birth-time')).toHaveValue('14:30')
  await page.getByLabel('Ciudad de nacimiento').fill('Madrid')
  await page
    .getByRole('option', { name: /Madrid/ })
    .first()
    .click()

  const chartResponse = page.waitForResponse((response) => response.url().includes('/api/chart'))
  await page.getByRole('button', { name: 'Calcular mi carta' }).click()
  expect((await chartResponse).ok()).toBeTruthy()

  await expect(page).toHaveURL(/\/carta\//, { timeout: 15_000 })
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prueba E2E')
  await expect(page.getByRole('img', { name: /BodyGraph/ })).toBeVisible()
  await expect(page.locator('[data-center]')).toHaveCount(9)
  await expect(page.locator('[data-gate]')).toHaveCount(64)
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
