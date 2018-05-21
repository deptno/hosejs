#!/usr/bin/env node

import * as meow from 'meow'
import * as stdin from 'get-stdin'
import {vm} from './vm'
import {readFile, print} from './io'

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
`, {
  flags: {
    file: {type: 'string', alias: 'f'},
    tab : {type: 'string', alias: 't', default: '2'},
  }
})

async function main() {
  const {input, flags} = program

  if (flags.file) {
    const buffer = await readFile(flags.file)
    input.unshift(buffer.toString())
  }

  try {
    const _ = JSON.parse(await stdin())
    const sandbox = {_}

    vm(sandbox, input.map(c => `_ = ${c}`).join(';'))

    print(sandbox._, parseInt(flags.tab))
  } catch (e) {
    console.error('🚫', e)
    process.exit(1)
  }
}

main()