var assert        = require('assert'),
    WatcherConfig = require('../../lib/model/watcher-config')


describe('model.WatcherConfig', function () {
	it('createDefault()', function () {
		var config = WatcherConfig.createDefault()
		assert.deepEqual([], config.tasks())
	})

	it('excludesOnFileRelativePath()/fileIsExclude()', function () {
		var config = WatcherConfig.create()
		assert.ok(!config.fileIsExclude('xyz'))

		var config = WatcherConfig.create({excludesOnFileRelativePath: /abc/})
		assert.ok(config.fileIsExclude('dir/abc/xyz'))

		var config = WatcherConfig.create({excludesOnFileRelativePath: [/abc/, /xyz/]})
		assert.ok(config.fileIsExclude('xyz/123'))

		var config = WatcherConfig.create({
			excludesOnFileRelativePath: function () {
				return /123/
			}
		})
		assert.ok(config.fileIsExclude('xyz/123'))

		var config = WatcherConfig.create({excludesOnFileRelativePath: 'abc'})
		assert.ok(!config.fileIsExclude('abc'))
	})
})