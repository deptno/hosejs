import {createContext, runInContext} from 'vm'
import * as R from 'ramda'

export function vm(sandbox: object, code: string) {
  createContext(sandbox)
  runInContext(code, sandbox)
}

const __ = (R as any).__
export const ramdaInvoker = R.compose(
  R.join(''),
  R.intersperse(__, ['_ = ', '(_)']) as any
)
export const invoker = R.concat(`_ = `)
