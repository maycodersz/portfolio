import { expect, test } from '@playwright/test'

test('automation defaults to All with CRM first and live fallback is honest', async ({ page }) => {
  await page.goto('/')
  await page.locator('#automation').scrollIntoViewIfNeeded()
  const filters = page.locator('#automation nav[aria-label="Filter by category"] button')
  await expect(filters.first()).toContainText('All')
  await expect(filters.first()).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#automation h3').first()).toContainText('GHL Public Request Form')
  await expect(page.getByRole('status', { name: 'Live count unavailable' })).toBeVisible()
})

test('Contact follows Work and hash navigation reaches the section', async ({ page, isMobile }) => {
  await page.goto('/')
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click()
  }
  const primary = isMobile
    ? page.locator('#mobile-nav-overlay nav')
    : page.locator('header nav[aria-label="Primary"]')
  const labels = await primary.getByRole('link').allTextContents()
  expect(labels.indexOf('Contact')).toBe(labels.indexOf('Work') + 1)
  await primary.getByRole('link', { name: 'Contact', exact: true }).click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport()
})

test('privacy page is reachable', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByRole('heading', { name: 'Privacy and analytics' })).toBeVisible()
})

test('privacy preference is toggleable, persistent, and uses two equal actions', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('portfolio_analytics_consent')) {
      localStorage.setItem('portfolio_analytics_consent', 'denied')
    }
  })
  await page.goto('/privacy')

  const enable = page.getByRole('button', { name: 'Enable analytics on this browser' })
  await expect(enable).toHaveAttribute('aria-pressed', 'false')
  await enable.click()
  const disable = page.getByRole('button', { name: 'Disable analytics on this browser' })
  await expect(disable).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await expect(page.getByRole('button', { name: 'Disable analytics on this browser' })).toBeVisible()
  await page.getByRole('button', { name: 'Disable analytics on this browser' }).click()
  await expect(page.getByRole('button', { name: 'Enable analytics on this browser' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back home' })).toHaveCount(0)

  const preferenceWidth = await page.getByRole('button', { name: 'Enable analytics on this browser' }).evaluate((element) => element.clientWidth)
  const contactWidth = await page.getByRole('link', { name: 'Contact Maycoder' }).last().evaluate((element) => element.clientWidth)
  expect(preferenceWidth).toBe(contactWidth)
})

test('up control sits above live activity at the original content inset', async ({ page, isMobile }) => {
  test.skip(isMobile, 'explicit desktop position check')
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/privacy')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  const up = page.getByRole('button', { name: 'Back to top of page' })
  const live = page.getByRole('status', { name: 'Live count unavailable' })
  const [upBox, liveBox] = await Promise.all([up.boundingBox(), live.boundingBox()])
  expect(upBox).not.toBeNull()
  expect(liveBox).not.toBeNull()
  if (upBox && liveBox) {
    expect(upBox.y + upBox.height).toBeLessThanOrEqual(liveBox.y)
    expect(1440 - (liveBox.x + liveBox.width)).toBeGreaterThanOrEqual(135)
    expect(1440 - (liveBox.x + liveBox.width)).toBeLessThanOrEqual(150)
  }
})

test('modal details remain reachable on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('#automation').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: /View GHL Public Request Form/i }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByText('Tech stack', { exact: true }).scrollIntoViewIfNeeded()
  await expect(dialog.getByText('Tech stack', { exact: true })).toBeInViewport()
  await dialog.getByText('Data storage', { exact: true }).scrollIntoViewIfNeeded()
  await expect(dialog.getByText('Data storage', { exact: true })).toBeInViewport()
})

test('upward scrolling does not re-arm section entrances until Hero resets the cycle', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop timing check')
  await page.goto('/')
  const automation = page.locator('#automation')
  await automation.scrollIntoViewIfNeeded()
  await expect(automation.locator('.animate-stat-pop-in').first()).toBeVisible()
  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(1900)
  await automation.scrollIntoViewIfNeeded()
  await expect(automation.locator('.animate-stat-pop-in')).toHaveCount(0)
  await page.locator('#hero').scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  await automation.scrollIntoViewIfNeeded()
  await expect(automation.locator('.animate-stat-pop-in').first()).toBeVisible()
})

test('floating controls avoid CV back navigation at acceptance widths', async ({ page, isMobile }) => {
  test.skip(isMobile, 'explicit viewport matrix runs once')
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/cv')
    const presence = page.getByRole('status', { name: 'Live count unavailable' })
    const back = page.getByRole('link', { name: /Back/i }).last()
    const [presenceBox, backBox] = await Promise.all([presence.boundingBox(), back.boundingBox()])
    expect(presenceBox).not.toBeNull()
    expect(backBox).not.toBeNull()
    if (presenceBox && backBox) {
      const separated = presenceBox.y + presenceBox.height <= backBox.y || backBox.y + backBox.height <= presenceBox.y
      expect(separated).toBe(true)
    }
  }
})
