import { describe, expect, it } from 'vitest'

import { portfolio } from '@/content/portfolio'
import { resolveSkillBrandSlug } from '@/lib/skillLogos'

describe('Google Maps lead outreach portfolio entry', () => {
  it('connects the workflow, evidence, results, and real service icons', () => {
    const project = portfolio.automationProjects.find(({ id }) => id === 'google-maps-lead-outreach')

    expect(project).toMatchObject({
      title: 'Google Maps Lead Scraper & Cold Email Outreach',
      categories: ['automation', 'cron'],
      tags: ['n8n', 'Google Maps', 'Apify', 'Gmail'],
      databases: ['Google Sheets'],
      imageLabels: ['Google Maps lead scraper', 'Scheduled email outreach', 'Lead results sheet'],
    })
    expect(project?.galleryImages).toHaveLength(2)

    const automationSkills = portfolio.skillGroups.find(({ name }) => name === 'AI Automation')
    expect(automationSkills?.items).toEqual(
      expect.arrayContaining(['Google Maps', 'Apify', 'Gmail', 'Google Sheets']),
    )
    expect(resolveSkillBrandSlug('Google Maps')).toBe('googlemaps')
    expect(resolveSkillBrandSlug('Apify')).toBe('apify')
    expect(resolveSkillBrandSlug('Gmail')).toBe('gmail')
    expect(resolveSkillBrandSlug('Google Sheets')).toBe('googlesheets')
  })
})
