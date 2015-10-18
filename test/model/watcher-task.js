var assert      = require('assert'),
    WatcherTask = require('../../lib/model/watcher-task')


describe('model.WatcherTask', function () {
	it('isEnabled()', function () {
		// undefined/default
		var t = WatcherTask.create()
		assert.equal(t.isEnabled(), false)

		// false
		var t = WatcherTask.create({isEnabled: false})
		assert.equal(t.isEnabled(), false)

		// true
		var t = WatcherTask.create({isEnabled: true})
		assert.equal(t.isEnabled(), true)

		// Function
		var flag = undefined
		var t = WatcherTask.create({
			isEnabled: function () {
				var result = flag
				flag = !flag
				return result
			}
		})
		assert.equal(t.isEnabled(), false)
		assert.equal(t.isEnabled(), true)
		assert.equal(t.isEnabled(), false)

		// Function throw error
		var t = WatcherTask.create({
			isEnabled: function () {
				throw new Error('test error')
			}
		})
		assert.equal(t.isEnabled(), false)
		assert.equal(t.isEnabled(), false)
	})

	it('isMatchOnFileRelativePath()', function () {
		// undefined/default
		var t = WatcherTask.create()
		assert.ok(!t.isMatchOnFileRelativePath({fileRelativePath: 'a'}))

		// Regexp
		var t = WatcherTask.create({matchOnFileRelativePath: /abc/})
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'abc/xyz'}))

		// Array<Regexp>
		var t = WatcherTask.create({
			matchOnFileRelativePath: [
				/abc/,
				/xyz/
			]
		})
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'abc'}))
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'xyz'}))
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'abc/xyz'}))

		// Function
		var index = 0
		var result = [true, true, false]
		var t = WatcherTask.create({
			matchOnFileRelativePath: function () {
				return result[index++]
			}
		})
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'abc'}))
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'abc'}))
		assert.ok(!t.isMatchOnFileRelativePath({fileRelativePath: 'xyz'}))

		// Function throw error
		var t = WatcherTask.create({
			matchOnFileRelativePath: function () {
				throw new Error('test error')
			}
		})
		assert.ok(!t.isMatchOnFileRelativePath({fileRelativePath: 'abc'}))
	})

	it('arguments()', function () {
		// undefined/default
		var t = WatcherTask.create()
		assert.equal(t.arguments(), '')

		// String
		var t = WatcherTask.create({arguments: 'abc'})
		assert.equal(t.arguments(), 'abc')

		// String with marcon
		var t = WatcherTask.create({arguments: '$marco'})
		assert.equal(t.arguments({marco: 'test'}), 'test')

		// Array<String>
		var t = WatcherTask.create({arguments: ['abc', '123']})
		assert.equal(t.arguments(), 'abc 123')

		// Function
		var t = WatcherTask.create({
			arguments: function (info) {
				return info
			}
		})
		assert.equal(t.arguments('test'), 'test')

		// Function throws
		var t = WatcherTask.create({
			arguments: function () {
				throw new Error('test error')
			}
		})
		assert.equal(t.arguments(), '')
	})

})