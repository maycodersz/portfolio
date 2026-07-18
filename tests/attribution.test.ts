// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'

import { captureAttribution } from '@/analytics/attribution'

describe('attribution capture', () => {
  beforeEach(() => sessionStorage.clear())

  it('captures only allowlisted values and cleans the visible URL', () => {
    history.replaceState({}, '', '/?utm_source=linkedin&utm_medium=social&utm_campaign=books&lead=opaque&email=nope')
    expect(captureAttribution()).toEqual({
      source: 'linkedin',
      campaign: 'books',
    })
    expect(location.search).toBe('?email=nope')
  })
})
