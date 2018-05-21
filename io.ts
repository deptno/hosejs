import * as fs from 'fs'

export function readFile(path: string, options?: any) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

export function print(output: any, tab: number) {
  if (typeof output === 'object') {
    return console.log(JSON.stringify(output, null, tab))
  }
  console.log(output)
}
