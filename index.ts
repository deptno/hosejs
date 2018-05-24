#!/usr/bin/env node

import * as meow from 'meow'
import * as stdin from 'get-stdin'
import {invoker, ramdaInvoker, vm} from './vm'
import {readFile, print} from './io'
import * as R from 'ramda'

const program = meow(`
  HoseJS
  Transform JSON with javascript.
  
  Usage
    $ cat some.json | j '[_].map(x => x.some_property)[0]'
    $ cat some.json | j '_.map(x => new Date(x.timestamp).toISOString())'
    $ cat some.json | j --file preload.js '.map(x => x.timestamp)'
  Advanced Usage
    visit https://github.com/deptno/hosejs#usage
  Alias
    j, js
  Options
    --file, -f      use javascript file first
    --tab, -t       JSON tab space (default: 2)
    --ramda, -r     write unary function then function is invoked with data automatically
`, {
  flags: {
    file : {type: 'string', alias: 'f'},
    tab  : {type: 'string', alias: 't', default: '2'},
    ramda: {type: 'boolean', alias: 'r'},
  }
})

async function main() {
  const {input, flags} = program

  if (flags.file) {
    const buffer = await readFile(flags.file)
    input.unshift(buffer.toString())
  }

  try {
    const source = await stdin()
    const sandbox: any = {...R, R, _: undefined}
    const coder = R.ifElse(
      Boolean,
      R.always(ramdaInvoker),
      R.always(invoker),
    )(flags.ramda)

    R.compose(
      R.assoc('_', (R as any).__, sandbox),
      R.tryCatch(JSON.parse, R.identity)
    )(source)

    vm(sandbox, input.map(coder).join(';'))

    print(sandbox._, parseInt(flags.tab))
  } catch (e) {
    console.error('🚫', e)
    process.exit(1)
  }
}

main()