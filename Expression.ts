import Param from './Param'
import { Op } from './Op'

export default class Exp {
  public static readonly zero: Exp = new Exp(0.0)
  public static readonly one: Exp = new Exp(1.0)
  public static readonly mOne: Exp = new Exp(-1.0)
  public static readonly two: Exp = new Exp(2.0)
  op: Op = Op.Undefined

  public a: Exp | null = null
  public b: Exp | null = null
  public param: Param | null = null
  public value: number = 0

  constructor()
  constructor(op: Op, a: Exp, b: Exp | null)
  constructor(value: number)
  constructor(p: Param)

  constructor(pOrValue?: Param | number | Op, a?: Exp, b?: Exp | null) {
    if (typeof pOrValue === 'undefined') {
      // use first constructor
    } else if (
      typeof pOrValue === 'number' &&
      typeof a !== 'undefined' &&
      typeof b !== 'undefined'
    ) {
      // use second constructor
      this.a = a
      this.b = b
      this.op = pOrValue
    } else if (typeof pOrValue === 'number') {
      // use third constructor
      // console.log("using number consructor", pOrValue);
      this.value = pOrValue
      this.op = Op.Const
    } else if (pOrValue instanceof Param) {
      // use fourth constructor

      // console.log("using Param consructor");
      this.param = pOrValue
      this.op = Op.Param
    }
  }

  public static add(a: Exp, b: Exp): Exp {
    // Eliminate a since it is unnecessary
    if (a.isZeroConst()) return b

    // Eliminate a since it is unnecessary
    if (b.isZeroConst()) return a

    // Prevent list from growing
    if (b.op === Op.Neg) return Exp.sub(a, b.a)
    if (a.op === Op.Neg) return Exp.sub(b, a.a)
    if (b.op === Op.Pos) return Exp.add(a, b.a)
    if (a.op === Op.Pos) return Exp.add(b, a.a)

    return new Exp(Op.Add, a, b)
  }

  public static sub(a: Exp, b: Exp): Exp {
    if (a.isZeroConst()) return new Exp(Op.Neg, b, null)
    if (b.isZeroConst()) return a
    return new Exp(Op.Sub, a, b)
  }

  public static mul(a: Exp, b: Exp): Exp {
    if (a.isZeroConst()) return this.zero
    if (b.isZeroConst()) return this.zero
    if (a.isOneConst()) return b
    if (b.isOneConst()) return a
    if (a.isMinusOneConst()) return new Exp(Op.Neg, b, null)
    if (b.isMinusOneConst()) return new Exp(Op.Neg, a, null)

    if (a.isConst() && b.isConst()) return new Exp(a.value * b.value)

    return new Exp(Op.Mul, a, b)
  }

  public static div(a: Exp, b: Exp): Exp {
    if (b.isOneConst()) return a
    if (a.isZeroConst()) return this.zero
    if (b.isMinusOneConst()) return new Exp(Op.Neg, a, null)

    return new Exp(Op.Div, a, b)
  }

  public static Sin(x: Exp): Exp {
    return new Exp(Op.Sin, x, null)
  }
  public static Cos(x: Exp): Exp {
    return new Exp(Op.Cos, x, null)
  }
  public static ACos(x: Exp): Exp {
    return new Exp(Op.ACos, x, null)
  }
  public static ASin(x: Exp): Exp {
    return new Exp(Op.ASin, x, null)
  }
  public static Sqrt(x: Exp): Exp {
    return new Exp(Op.Sqrt, x, null)
  }
  public static Sqr(x: Exp): Exp {
    return new Exp(Op.Sqr, x, null)
  }
  public static Abs(x: Exp): Exp {
    return new Exp(Op.Abs, x, null)
  }
  public static Sign(x: Exp): Exp {
    return new Exp(Op.Sign, x, null)
  }
  public static Atan2(x: Exp, y: Exp): Exp {
    return new Exp(Op.Atan2, x, y)
  }
  public static Expo(x: Exp): Exp {
    return new Exp(Op.Exp, x, null)
  }
  public static Sinh(x: Exp): Exp {
    return new Exp(Op.Sinh, x, null)
  }
  public static Cosh(x: Exp): Exp {
    return new Exp(Op.Cosh, x, null)
  }
  public static SFres(x: Exp): Exp {
    return new Exp(Op.SFres, x, null)
  }
  public static CFres(x: Exp): Exp {
    return new Exp(Op.CFres, x, null)
  }

  public Drag(to: Exp): Exp {
    return new Exp(Op.Drag, this, to)
  }

  // Utils
  public isZeroConst(): boolean {
    return this.op === Op.Const && this.value === 0.0
  }
  public isOneConst(): boolean {
    return this.op === Op.Const && this.value === 1.0
  }
  public isMinusOneConst(): boolean {
    return this.op === Op.Const && this.value === -1.0
  }
  public isConst(): boolean {
    return this.op === Op.Const
  }
  public isDrag(): boolean {
    return this.op === Op.Drag
  }

  public isUnary(): boolean {
    switch (this.op) {
      case Op.Const:
      case Op.Param:
      case Op.Sin:
      case Op.Cos:
      case Op.ACos:
      case Op.ASin:
      case Op.Sqrt:
      case Op.Sqr:
      case Op.Abs:
      case Op.Sign:
      case Op.Neg:
      case Op.Pos:
      case Op.Exp:
      case Op.Cosh:
      case Op.Sinh:
      case Op.CFres:
      case Op.SFres:
        return true
    }
    return false
  }

  public isAdditive(): boolean {
    switch (this.op) {
      case Op.Drag:
      case Op.Sub:
      case Op.Add:
        return true
    }
    return false
  }

  quoted(): string {
    if (this.isUnary()) return this.toString()
    return '(' + this.toString() + ')'
  }

  quotedAdd(): string {
    if (!this.isAdditive()) return this.toString()
    return '(' + this.toString() + ')'
  }

  public toString(): string {
    switch (this.op) {
      case Op.Const:
        return this.value.toString()
      case Op.Param:
        return this.param.name
      case Op.Add:
        return this.a.toString() + ' + ' + this.b.toString()
      case Op.Sub:
        return this.a.toString() + ' - ' + this.b.quotedAdd()
      case Op.Mul:
        return this.a.quotedAdd() + ' * ' + this.b.quotedAdd()
      case Op.Div:
        return this.a.quotedAdd() + ' / ' + this.b.quoted()
      case Op.Sin:
        return 'sin(' + this.a.toString() + ')'
      case Op.Cos:
        return 'cos(' + this.a.toString() + ')'
      case Op.ASin:
        return 'asin(' + this.a.toString() + ')'
      case Op.ACos:
        return 'acos(' + this.a.toString() + ')'
      case Op.Sqrt:
        return 'sqrt(' + this.a.toString() + ')'
      case Op.Sqr:
        return this.a.quoted() + ' ^ 2'
      case Op.Abs:
        return 'abs(' + this.a.toString() + ')'
      case Op.Sign:
        return 'sign(' + this.a.toString() + ')'
      case Op.Atan2:
        return 'atan2(' + this.a.toString() + ', ' + this.b.toString() + ')'
      case Op.Neg:
        return '-' + this.a.quoted()
      case Op.Pos:
        // return '+' + this.a.quoted()
        return '' + this.a.quoted()
      case Op.Drag:
        return this.a.toString() + ' ≈ ' + this.b.quotedAdd()
      case Op.Exp:
        return 'exp(' + this.a.toString() + ')'
      case Op.Sinh:
        return 'sinh(' + this.a.toString() + ')'
      case Op.Cosh:
        return 'cosh(' + this.a.toString() + ')'
      case Op.SFres:
        return 'sfres(' + this.a.toString() + ')'
      case Op.CFres:
        return 'cfres(' + this.a.toString() + ')'
      //case Op.Pow:	return Quoted(a) + " ^ " + Quoted(b);
    }
    return ''
  }
}

// const exp: Exp = new Exp(5)
// // console.log("First exp: ", exp, exp.isConst());

// const exp1: Exp = new Exp(new Param('x', true))
// // console.log("Second exp: ", exp1);

// // console.log("Addition: ", Exp.add(exp, exp1));

// const negativeExp: Exp = new Exp(Op.Neg, new Exp(5), null)

// const positiveExp: Exp = new Exp(Op.Pos, new Exp(5), null)

// const addition: Exp = Exp.add(exp1, negativeExp)

// console.log(Exp.add(Exp.mul(addition, positiveExp), positiveExp).toString())
// // wow it works! 👍
