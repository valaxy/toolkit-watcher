var assert      = require('assert'),
    masterFiles = require('../../lib/task/masterFiles')

var state
var setState = function (s) {
	state = s
}

describe('masterFiles', function () {
	it('_matchItem()', function () {
		var reg = /abc/

		// RegExp
		state = null
		assert.deepEqual(masterFiles._matchItem(reg, setState), [reg, 1])
		assert.equal(state, 'right')

		// Array, length=0
		state = null
		assert.deepEqual(masterFiles._matchItem([], setState), undefined)
		assert.equal(state, 'warn')

		// Array, length=1, right
		state = null
		assert.deepEqual(masterFiles._matchItem([reg], setState), [reg, 1])
		assert.equal(state, 'right')

		// Array, length=1, wrong
		state = null
		assert.deepEqual(masterFiles._matchItem([1], setState), undefined)
		assert.equal(state, 'warn')

		// Array, length=3
		state = null
		assert.deepEqual(masterFiles._matchItem([reg, 2.5, 'wrong'], setState), [reg, 2.5])
		assert.equal(state, 'right')

		// Else
		state = null
		assert.deepEqual(masterFiles._matchItem(123, setState), undefined)
		assert.equal(state, 'warn')
	})

	it('_onProcess()', function () {
		var fn = function () {
			return 'nothing'
		}

		// Undefined
		assert.deepEqual(masterFiles._onProcess(undefined, setState), undefined)
		assert.equal(state, 'right')

		// Function
		assert.deepEqual(masterFiles._onProcess(fn, setState), fn)
		assert.equal(state, 'right')

		// Else
		assert.deepEqual(masterFiles._onProcess(123, setState), undefined)
		assert.equal(state, 'warn')
	})
})