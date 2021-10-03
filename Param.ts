import Exp from './Expression'

export default class Param {
  public name: string = ''
  public reduceable: boolean = true
  public changed: boolean = false
  private _value: number | null = null
  public exp: Exp

  public get value(): number | null {
    return this._value
  }

  public set value(value: number | null) {
    if (this._value === value) return
    this.changed = true
    this._value = value
  }

  constructor(name: string, reducable?: boolean)
  constructor(name: string, value: number)
  constructor(name: string, valueOrReducable: number | boolean) {
    if (typeof valueOrReducable === 'boolean') {
      // use first constructor
      this.name = name
      this.reduceable = valueOrReducable
      this.exp = new Exp(this)
    } else {
      this.name = name
      this._value = valueOrReducable
      this.exp = new Exp(this)
    }
  }
}
