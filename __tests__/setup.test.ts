import { describe, it, expect } from 'vitest'

describe('Basic test setup', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should verify test environment is working', () => {
    expect(typeof window).toBe('object')
  })
})