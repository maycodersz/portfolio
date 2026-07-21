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
      imageLabels: ['Google Maps lead scraper', 'Scheduled cold email workflow', 'Google Sheets lead results'],
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

describe('automation modal image identification', () => {
  it('gives every project image an exact, non-empty caption and alt-text source', () => {
    for (const project of portfolio.automationProjects) {
      const imageCount = 1 + (project.galleryImages?.length ?? 0)

      expect(project.imageLabels, `${project.title} image labels`).toHaveLength(imageCount)
      for (const label of project.imageLabels) {
        expect(label.trim(), `${project.title} has a blank image label`).not.toBe('')
        expect(label, `${project.title} still uses the generic fallback`).not.toBe('Workflow screenshot')
      }
    }
  })
})
