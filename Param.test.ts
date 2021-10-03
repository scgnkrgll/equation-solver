import Param from './Param'

describe('Param', () => {
  it('can be constructed without value and set later', () => {
    const param = new Param('x')

    expect(param.name).toBe('x')

    expect(param.changed).toBe(false)
    param.value = 2
    expect(param.changed).toBe(true)

    expect(param.value).toBe(2)
  })
  it('can be constructed with value', () => {
    const param = new Param('x', 5)
    expect(param.changed).toBe(false)
    expect(param.value).toBe(5)
  })
})
