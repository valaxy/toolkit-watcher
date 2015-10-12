var assert      = require('assert'),
    WatcherTask = require('../../lib/model/watcher-task')


describe('model.WatcherTask', function () {
	it('isEnabled()', function () {
		var t = WatcherTask.create({})
		assert.equal(t.isEnabled(), false)

		var t = WatcherTask.create({isEnabled: false})
		assert.equal(t.isEnabled(), false)

		var t = WatcherTask.create({isEnabled: true})
		assert.equal(t.isEnabled(), true)

		var flag = undefined
		t = WatcherTask.create({
			isEnabled: function () {
				var result = flag
				flag = !flag
				return result
			}
		})
		assert.equal(t.isEnabled(), false)
		assert.equal(t.isEnabled(), true)
		assert.equal(t.isEnabled(), false)
	})

	it('matchOnFileRelativePath()/isMatchOnFileRelativePath()', function () {
		var t = WatcherTask.create()
		assert.ok(!t.isMatchOnFileRelativePath('a'))

		var t = WatcherTask.create({matchOnFileRelativePath: /abc/})
		assert.ok(t.isMatchOnFileRelativePath('abc/xyz'))

		var t = WatcherTask.create({
			matchOnFileRelativePath: [
				/abc/,
				/xyz/
			]
		})
		assert.ok(t.isMatchOnFileRelativePath('abc'))
		assert.ok(t.isMatchOnFileRelativePath('xyz'))
		assert.ok(t.isMatchOnFileRelativePath('abc/xyz'))

		var index = 0
		var result = [
			undefined,
			/abc/,
			[/xyz/]
		]
		var t = WatcherTask.create({
			matchOnFileRelativePath: function () {
				return result[index++]
			}
		})
		assert.ok(!t.isMatchOnFileRelativePath('abc'))
		assert.ok(t.isMatchOnFileRelativePath('abc'))
		assert.ok(t.isMatchOnFileRelativePath('xyz'))
	})

})