import Exp from './Expression'

describe('Constant expression', () => {
  let constantExpression: Exp
  beforeAll(() => {
    constantExpression = new Exp(5)
  })
  it('should be constant', () => {
    expect(constantExpression.isConst()).toBe(true)
  })
  it('is equal to constructed value', () => {
    expect(constantExpression.value).toBe(5)
  })
  it('is unary', () => {
    expect(constantExpression.isUnary()).toBe(true)
  })
  it('is not additive', () => {
    expect(constantExpression.isAdditive()).toBe(false)
  })
  it('can be converted to string', () => {
    expect(constantExpression.toString()).toBe('5')
  })
  it('is zero constant', () => {
    const exp = new Exp(0)
    expect(exp.isZeroConst()).toBe(true)
  })
  it('is one constant', () => {
    const exp = new Exp(1)
    expect(exp.isOneConst()).toBe(true)
  })
  it('is minus one constant', () => {
    const exp = new Exp(-1)
    expect(exp.isMinusOneConst()).toBe(true)
  })
})
