var assert      = require('assert'),
    masterFiles = require('../../lib/task/masterFiles')

var state
var setState = function (s, msg, d) {
	state = s
	return d
}

describe('masterFiles', function () {
	it('_matchItem()', function () {
		var reg = /abc/

		// Undefined
		state = null
		assert.deepEqual(masterFiles._matchItem(undefined, setState), undefined)
		assert.equal(state, 'right')

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
		assert.equal(masterFiles._onProcess(undefined, setState), masterFiles._onProcessDefault)
		assert.equal(state, 'right')

		// Function
		assert.deepEqual(masterFiles._onProcess(fn, setState), fn)
		assert.equal(state, 'right')

		// Else
		assert.equal(masterFiles._onProcess(123, setState), masterFiles._onProcessDefault)
		assert.equal(state, 'warn')
	})

	it('_match()', function () {
		var reg = /123/
		var reg2 = /xyz/

		// Undefined
		assert.deepEqual(masterFiles._match(undefined, setState), [])
		assert.equal(state, 'right')

		// RegExp
		assert.deepEqual(masterFiles._match(reg, setState), [[reg, 1]])
		assert.equal(state, 'right')

		// Array-empty
		assert.deepEqual(masterFiles._match([], setState), [])
		assert.equal(state, 'right')

		// Array
		assert.deepEqual(masterFiles._match([reg, [reg2, 2]], setState), [[reg, 1], [reg2, 2]])
		assert.equal(state, 'right')

		// Else
		assert.deepEqual(masterFiles._match('xyz', setState), [])
		assert.equal(state, 'warn')
	})

	it('_masterFiles', function () {
		var reg = /123/
		assert.deepEqual(masterFiles._masterFiles(reg, setState), {
			match    : [[reg, 1]],
			onProcess: masterFiles._onProcessDefault
		})
		assert.deepEqual(state, {
			match    : ['right', undefined],
			onProcess: ['right', undefined]
		})
	})
})