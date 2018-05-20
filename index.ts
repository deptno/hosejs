#!/usr/bin/env node

import {chomp, chunksToLinesAsync} from '@rauschma/stringio'
import {createContext, runInContext} from 'vm'
import * as meow from 'meow'
import * as fs from 'fs'
import {promisify} from 'util'

const program = meow(`
  HoseJS
  Transform JSON with javascript.
  
	Usage
	  $ cat some.json | j '[_].map(x => x.some_property)[0]'
	  $ cat some.json | j '_.map(x => new Date(x.timestamp).toISOString())'
	  $ cat some.json | j --file preload.js '.map(x => x.timestamp)'
  Alias
	  js
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
  const readFile = promisify(fs.readFile)
  const stream = process.stdin as any
  const lines = []

  if (flags.file) {
    input.unshift((await readFile(flags.file)).toString())
  }

  for await (const line of chunksToLinesAsync(stream)) {
    lines.push(chomp(line))
  }

  try {
    const _ = JSON.parse(lines.join(''))
    const sandbox = {_}

    createContext(sandbox)
    runInContext(input.map(c => `_ = ${c}`).join(';'), sandbox)

    print(sandbox._, parseInt(flags.tab))
  } catch (e) {
    console.error('🚫', e)
    process.exit(1)
  }
}

function print(output, tab: number) {
  if (typeof output === 'object') {
    return console.log(JSON.stringify(output, null, tab))
  }
  console.log(output)
}

main()