import {createContext, runInContext} from 'vm'

export function vm(sandbox: object, code: string) {
  createContext(sandbox)
  runInContext(code, sandbox)
}