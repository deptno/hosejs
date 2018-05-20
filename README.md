# HoseJS
[![npm](https://img.shields.io/npm/dt/hosejs.svg?style=for-the-badge)](https://www.npmjs.com/package/hosejs)

![hosejs](https://github.com/deptno/hosejs/raw/master/asset/hosejs.gif)

> Required node > v10

Transform JSON data with just **JavaScript** in terminal

`jq`? javascript is clearly better option for people already use javascript.

## Options

- `--file` option provide you to apply pre-defined script first
- `--tab` if result is Object, print JSON format with specified tab size (default: 2)

## Install

```
npm -g install hosejs
```

## command

`j` or `js`


## usage

```
$ cat some.json | j '_.map(x => x.timestamp)'
$ cat some.json | j '_.map(x => x.timestamp)' --tab 4
$ cat some.json | j '_.map(x => x.timestamp)' --file pre.js --tab 2
$ cat some.json | j '_.map(x => x.timestamp)' > some.json
$ cat some.json | j '[_].map(x => x.some_property + '👍')[0]'
$ cat some.json | j '_.map(x => new Date(x.timestamp).toISOString())'
$ cat some.json | j --file preload.js '_.map(x => x.timestamp)'
$ http https://swapi.co/api/people/ | j 'Object.keys(_)'
$ http https://swapi.co/api/people/ | j '_.count'
http https://swapi.co/api/people/ | j '_.results.map(x => x.name)'
```

## License

MIT
