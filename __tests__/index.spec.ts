import {readFile, print} from '../io'
import * as path from 'path'
import {vm} from '../vm'

describe('hosejs', () => {
  describe('vm', () => {
    it('primitive', () => {
      const sandbox = {_: 1}
      vm(sandbox, '_ += 1')
      expect(sandbox._).toEqual(2)
      vm(sandbox, '_ += 1')
      expect(sandbox._).toEqual(3)
      vm(sandbox, '_ += 1;_ += 1')
      expect(sandbox._).toEqual(5)
    })
    it('array', () => {
      const sandbox = {_: [1, 2, 3, 4, 5]}
      const concat = '_ = _.concat(_)'
      vm(sandbox, concat)
      expect(sandbox._).toHaveLength(10)
      vm(sandbox, concat)
      expect(sandbox._).toHaveLength(20)
      vm(sandbox, [concat, concat].join(';'))
      expect(sandbox._).toHaveLength(80)
    })
  })

  describe('io', () => {
    it('read valid js', async done => {
      const read = await readFile(path.join(__dirname + '/valid.js'))
      done()
    })

    it('read invalid js', async done => {
      try {
        await readFile('./does-not-exist.js')
      } catch (e) {
        expect(e.code).toEqual('ENOENT')
        done()
      }
    })

    it('print', () => {
      console.log = jest.fn()
      // run your code

      const object = {this: 1}
      print(object, 1)
      print(object, 2)
      print('primitive ignore tab 1', 1)
      print('primitive ignore tab 2', 2)
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(object, null, 1))
      expect(console.log).toHaveBeenCalledWith(JSON.stringify(object, null, 2))
      expect(console.log).toHaveBeenCalledWith('primitive ignore tab 1')
      expect(console.log).toHaveBeenCalledWith('primitive ignore tab 2')
    })
  })
})