import { expect, test } from '@playwright/test'

test('renders the application shell', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('El entorno está preparado')
  await expect(page.getByRole('link', { name: 'Comprobar salud del servicio' })).toBeVisible()
})

test('exposes a healthy service endpoint', async ({ request }) => {
  const response = await request.get('/api/health')

  expect(response.ok()).toBeTruthy()
  expect(await response.json()).toMatchObject({
    status: 'ok',
    service: 'proyectomental-v2',
  })
})
