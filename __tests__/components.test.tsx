import { describe, it, expect } from 'vitest'

// Simple utility function tests to demonstrate testing infrastructure
describe('Utility functions', () => {
  it('should validate basic math operations', () => {
    expect(2 + 2).toBe(4)
    expect(10 * 5).toBe(50)
  })
  
  it('should validate string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO')
    expect('world'.length).toBe(5)
  })
  
  it('should validate array operations', () => {
    const arr = [1, 2, 3]
    expect(arr.length).toBe(3)
    expect(arr.includes(2)).toBe(true)
    expect(arr.filter(x => x > 1)).toEqual([2, 3])
  })
})