var assert        = require('assert'),
    WatcherConfig = require('../../lib/model/watcher-config')


describe('model.WatcherConfig', function () {
	it('createDefault()', function () {
		var config = WatcherConfig.createDefault()
		assert.deepEqual([], config.tasks())
	})

	it('isIgnoreFile()', function () {
		// undefined/default
		var config = WatcherConfig.create()
		assert.ok(!config.isIgnoreFile('xyz'))

		// regexp
		var config = WatcherConfig.create({ignoreOnFileRelativePath: /abc/})
		assert.ok(config.isIgnoreFile({fileRelativePath: 'dir/abc/xyz'}))

		// regexp array
		var config = WatcherConfig.create({ignoreOnFileRelativePath: [/abc/, /xyz/]})
		assert.ok(config.isIgnoreFile({fileRelativePath: 'xyz/123'}))

		// function
		var config = WatcherConfig.create({
			ignoreOnFileRelativePath: function (info) {
				return !!info.fileRelativePath.match(/123/)
			}
		})
		assert.ok(config.isIgnoreFile({fileRelativePath: 'xyz/123'}))

		// function but throw error
		var config = WatcherConfig.create({
			ignoreOnFileRelativePath: function () {
				throw new Error('test error')
			}
		})
		assert.ok(!config.isIgnoreFile({fileRelativePath: 'abc'}))

		// wrong type
		var config = WatcherConfig.create({ignoreOnFileRelativePath: 'abc'})
		assert.ok(!config.isIgnoreFile({fileRelativePath: 'abc'}))
	})
})