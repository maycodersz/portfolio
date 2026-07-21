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

test('Google Maps outreach project shows its scraper, email, and results evidence', async ({ page }) => {
  await page.goto('/')
  const automation = page.locator('#automation')
  await automation.scrollIntoViewIfNeeded()

  await automation
    .locator('nav[aria-label="Filter by category"]')
    .getByRole('button', { name: /^Cron/ })
    .click()
  await automation
    .locator('nav[aria-label="Automation Projects pagination"]')
    .getByRole('button')
    .last()
    .click()

  const title = 'Google Maps Lead Scraper & Cold Email Outreach'
  await expect(automation.getByRole('heading', { name: title })).toBeVisible()
  await automation.getByRole('button', { name: `View ${title}` }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: title })).toBeVisible()
  await expect(dialog.getByText('Google Maps lead scraper', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Google Maps', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Apify', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Gmail', { exact: true })).toBeVisible()
  await expect(dialog.getByText('Google Sheets', { exact: true })).toBeVisible()

  await dialog.getByRole('button', { name: 'Next image' }).click()
  await expect(dialog.getByText('Scheduled email outreach', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Next image' }).click()
  await expect(dialog.getByText('Lead results sheet', { exact: true })).toBeVisible()
})

test('navigation matches the landing hierarchy and hash links reach their sections', async ({ page, isMobile }) => {
  await page.goto('/')
  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click()
  }
  const primary = isMobile
    ? page.locator('#mobile-nav-overlay nav')
    : page.locator('header nav[aria-label="Primary"]')
  const labels = await primary.getByRole('link').allTextContents()
  expect(labels.slice(0, 5)).toEqual(['Solutions', 'Process', 'Case Study', 'Work', 'FAQ'])
  expect(labels).not.toContain('Contact')
  expect(labels).not.toContain('CV')
  await primary.getByRole('link', { name: 'Case Study', exact: true }).click()
  await expect(page).toHaveURL(/#case-study$/)
  await expect(page.locator('#case-study')).toBeInViewport()

  if (isMobile) {
    await page.getByRole('button', { name: 'Open menu' }).click()
  }
  const faqNavigation = isMobile
    ? page.locator('#mobile-nav-overlay nav')
    : page.locator('header nav[aria-label="Primary"]')
  await faqNavigation.getByRole('link', { name: 'FAQ', exact: true }).click()
  await expect(page).toHaveURL(/#faq$/)
  await expect(page.locator('#faq')).toBeInViewport()
})

test('automation review progresses from business details to workflow details without submitting', async ({ page }) => {
  await page.goto('/#contact')
  const contactSidebar = page.getByRole('complementary', { name: 'Direct contact and social links' })
  await expect(contactSidebar).toBeVisible()
  await expect(contactSidebar.getByRole('link', { name: /Email/ })).toBeVisible()
  await expect(contactSidebar.getByRole('link', { name: /LinkedIn/ })).toBeVisible()
  await expect(contactSidebar.getByRole('link', { name: 'Facebook', exact: true })).toBeVisible()
  await expect(contactSidebar.getByRole('link', { name: 'Instagram', exact: true })).toBeVisible()
  await expect(contactSidebar.getByRole('link', { name: 'TikTok', exact: true })).toBeVisible()
  await expect(contactSidebar.getByRole('link', { name: 'YouTube', exact: true })).toBeVisible()
  await expect(contactSidebar.getByRole('link', { name: 'Privacy and analytics' })).toHaveCount(0)
  await expect(page.locator('footer').getByRole('link', { name: 'Privacy and analytics' })).toBeVisible()

  await page.getByLabel('Name', { exact: true }).fill('QA Visitor')
  await page.getByLabel('Work email', { exact: true }).fill('qa@example.com')
  await page.getByLabel('Company name', { exact: true }).fill('QA Company')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()

  await expect(page.getByText('Step 2 of 2', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'The workflow' })).toBeVisible()
  await expect(page.getByLabel('Industry', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /Continue to calendar/ })).toBeVisible()
})

test('successful review shows only the Google appointment button', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'calendar', {
      configurable: true,
      value: {
        schedulingButton: {
          load: ({ label, target }: { label: string; target: HTMLElement }) => {
            const button = document.createElement('button')
            button.type = 'button'
            button.textContent = label
            target.appendChild(button)
          },
        },
      },
    })
  })
  await page.route('https://splitforms.com/api/submit', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }))
  await page.goto('/#contact')

  await page.getByLabel('Name', { exact: true }).fill('QA Visitor')
  await page.getByLabel('Work email', { exact: true }).fill('qa@example.com')
  await page.getByLabel('Company name', { exact: true }).fill('QA Company')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByLabel('Industry', { exact: true }).selectOption({ index: 1 })
  await page.getByLabel('Team size', { exact: true }).selectOption({ index: 1 })
  await page.getByLabel('Process to improve', { exact: true }).selectOption({ index: 1 })
  await page.getByLabel('Timeframe', { exact: true }).selectOption({ index: 1 })
  await page.getByLabel('What is the current bottleneck?').fill('Manual client follow-up is slowing the team down.')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: /Continue to calendar/ }).click()

  await expect(page.getByRole('heading', { name: 'Choose a time' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Book an appointment' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open the booking page directly' })).toHaveCount(0)
})

test('automation review reports validation beside each invalid field', async ({ page }) => {
  await page.goto('/#contact')
  await expect(page.getByLabel('Name', { exact: true })).toHaveAttribute('placeholder', 'Your name')
  await expect(page.getByLabel('Work email', { exact: true })).toHaveAttribute('placeholder', 'you@company.com')
  await expect(page.getByLabel('Company name', { exact: true })).toHaveAttribute('placeholder', 'Company name')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()

  const name = page.getByLabel('Name', { exact: true })
  const email = page.getByLabel('Work email', { exact: true })
  const company = page.getByLabel('Company name', { exact: true })
  await expect(name).toBeFocused()
  await expect(name).toHaveAttribute('aria-invalid', 'true')
  await expect(email).toHaveAttribute('aria-invalid', 'true')
  await expect(company).toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByText('Please enter your name.', { exact: true })).toBeVisible()
  await expect(page.getByText('Please enter your work email.', { exact: true })).toBeVisible()
  await expect(page.getByText('Please enter your company name.', { exact: true })).toBeVisible()
  await expect(page.getByLabel(/Company website/)).not.toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#contact [role="alert"]')).toHaveCount(0)

  await name.fill('QA Visitor')
  await expect(page.getByText('Please enter your name.', { exact: true })).toHaveCount(0)
  await expect(name).toHaveAttribute('aria-invalid', 'false')
  await email.fill('invalid-email')
  await company.fill('QA Company')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(email).toBeFocused()
  await expect(page.getByText('Please enter a valid work email address.', { exact: true })).toBeVisible()

  await email.fill('qa@example.com')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByRole('button', { name: /Continue to calendar/ }).click()

  await expect(page.getByLabel('Industry', { exact: true })).toBeFocused()
  for (const message of [
    'Please choose your industry.',
    'Please choose your team size.',
    'Please choose a process to improve.',
    'Please choose a timeframe.',
    'Please describe the current bottleneck.',
    'Please confirm that Maycoder may use these details to respond.',
  ]) {
    await expect(page.getByText(message, { exact: true })).toBeVisible()
  }
  await expect(page.getByLabel(/Current tools/)).not.toHaveAttribute('aria-invalid', 'true')
  await expect(page.getByLabel('Optional budget range')).not.toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#contact [role="alert"]')).toHaveCount(0)
})

test('FAQ starts collapsed and exposes answers through accessible controls', async ({ page }) => {
  await page.goto('/#faq')
  const faq = page.locator('#faq')
  const questions = faq.locator('button[aria-expanded]')
  await expect(questions).toHaveCount(8)
  for (const question of await questions.all()) {
    await expect(question).toHaveAttribute('aria-expanded', 'false')
  }

  const firstQuestion = questions.first()
  await firstQuestion.click()
  await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true')
  await expect(faq.getByText(/I work best with service businesses/)).toBeVisible()
  await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'false')
})

test('AccountingOps teaser opens the full eight-workflow case study', async ({ page }) => {
  await page.goto('/#case-study')
  const teaser = page.locator('#case-study')
  await expect(teaser.getByRole('heading', { name: 'AccountingOps Client Operations System' })).toBeVisible()
  await expect(teaser.getByText(/not a claim of a live client deployment/)).toHaveCount(0)
  await teaser.getByRole('link', { name: /View the full system/ }).click()

  await expect(page).toHaveURL(/\/work\/accountingops-automation-system$/)
  await expect(page.getByRole('heading', { name: 'AccountingOps Client Operations System' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Book a similar system/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Back to overview/ })).toBeVisible()
  const workflowSection = page.locator('section[aria-labelledby="workflow-evidence-title"]')
  await workflowSection.scrollIntoViewIfNeeded()
  const workflowFilters = workflowSection.getByRole('navigation', { name: 'Filter AccountingOps workflows by category' })
  await expect(workflowFilters.getByRole('button')).toHaveCount(5)
  await expect(workflowFilters.getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true')
  await workflowFilters.getByRole('button', { name: /^AI/ }).click()
  await expect(workflowSection.getByRole('heading', { name: 'GHL Document Created Processor' })).toBeVisible()
  await workflowFilters.getByRole('button', { name: /^All/ }).click()
  const workflowPagination = workflowSection.getByRole('navigation', { name: 'AccountingOps workflows pagination' })
  await expect(workflowPagination.getByRole('button')).toHaveCount(8)
  await expect(workflowSection.getByRole('heading', { name: 'GHL Public Request Form' })).toBeVisible()
  await workflowSection.getByRole('button', { name: /View workflow evidence GHL Public Request Form/ }).first().click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText(/Workflow evidence 1 of/)).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Previous workflow image' })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Next workflow image' })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeVisible()
  await expect(dialog.locator('[aria-label="Workflow image thumbnails"]')).toHaveCount(0)
  await expect(dialog.getByText('Automation', { exact: true }).first()).toBeVisible()
  await expect(dialog.getByText('CRM', { exact: true }).first()).toBeVisible()
  await dialog.getByRole('button', { name: 'Next workflow image' }).click()
  await expect(dialog.getByText(/Workflow evidence 2 of/)).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Trigger' })).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Human checkpoint' })).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Tech stack' })).toBeVisible()
})

test('landing sections follow the requested conversion order', async ({ page }) => {
  await page.goto('/')
  const order = await page.evaluate(() => {
    const selectors = ['#hero', 'section[aria-label="Technologies and tools"]', '#automation-helps', '#solutions', '#process', '#case-study', '#works', 'section[aria-label="OLFU Academic Hub"]', '#faq', '#contact', 'footer']
    return selectors.map((selector) => document.querySelector(selector)?.getBoundingClientRect().top ?? -1)
  })
  expect(order.every((position, index) => index === 0 || position > order[index - 1])).toBe(true)
  await expect(page.getByText('Open to integrating any other API or service your project needs.')).toBeVisible()
})

test('landing containers match Automation Work while the website project stays narrower', async ({ page, isMobile }) => {
  test.skip(isMobile, 'explicit viewport matrix runs once')
  const selectedSelectors = [
    '#automation-helps .max-w-7xl',
    '#solutions .max-w-7xl',
    '#process .max-w-7xl',
    '#case-study .max-w-7xl',
    '#faq .max-w-7xl',
    '#contact .max-w-7xl',
  ]

  for (const width of [375, 768, 1024, 1600]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const selectedWidths = await Promise.all(selectedSelectors.map((selector) => page.locator(selector).evaluate((element) => element.getBoundingClientRect().width)))
    expect(new Set(selectedWidths.map((value) => Math.round(value))).size).toBe(1)
    if (width >= 768) {
      const automationWidth = await page.locator('#automation .max-w-7xl').evaluate((element) => element.getBoundingClientRect().width)
      expect(Math.round(selectedWidths[0])).toBe(Math.round(automationWidth))
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  }

  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/')
  const automationWidth = await page.locator('#automation .max-w-7xl').evaluate((element) => element.getBoundingClientRect().width)
  const websiteWidth = await page.locator('section[aria-label="OLFU Academic Hub"] .max-w-5xl').first().evaluate((element) => element.getBoundingClientRect().width)
  expect(websiteWidth).toBeLessThan(automationWidth)
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
