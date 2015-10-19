var assert        = require('assert'),
    WatcherConfig = require('../../lib/model/watcher-config')


describe('model.WatcherConfig', function () {
	it('createDefault()', function () {
		var config = WatcherConfig.createDefault()
		assert.deepEqual([], config.tasks())
	})

	describe('isMatchFile()', function () {
		it('only match', function () {
			// undefined
			var config = WatcherConfig.create()
			assert.ok(!config.isMatchFile(''))

			// string
			var config = WatcherConfig.create({matchOnFileRelativePath: 'a/*.js'})
			assert.ok(config.isMatchFile({fileRelativePath: 'a/b.js'}))

			// regExp
			var config = WatcherConfig.create({matchOnFileRelativePath: /\.js$/})
			assert.ok(config.isMatchFile({fileRelativePath: 'xyz.js'}))

			// array
			var config = WatcherConfig.create({
				matchOnFileRelativePath: [
					'**/*.js',
					/abc$/
				]
			})
			assert.ok(config.isMatchFile({fileRelativePath: 'a/b/c/d/e.js'}))
			assert.ok(config.isMatchFile({fileRelativePath: 'xxxabc'}))
			assert.ok(!config.isMatchFile({fileRelativePath: 'js'}))
		})

		it('match then ignore', function () {
			// undefined
			var config = WatcherConfig.create({
				matchOnFileRelativePath: '**/*'
			})
			assert.ok(config.isMatchFile({fileRelativePath: 'xyz'}))

			// array
			var config = WatcherConfig.create({
				matchOnFileRelativePath : '**/*',
				ignoreOnFileRelativePath: [
					'**/*.js',
					/xyz/
				]
			})
			assert.ok(config.isMatchFile({fileRelativePath: '123'}))
			assert.ok(!config.isMatchFile({fileRelativePath: 'b.js'}))
			assert.ok(!config.isMatchFile({fileRelativePath: 'a/b.js'}))
			assert.ok(!config.isMatchFile({fileRelativePath: 'aaxyzbb'}))
		})
	})


	//it('isIgnoreFile()', function () {
	//	// undefined/default
	//	var config = WatcherConfig.create()
	//	assert.ok(!config.isIgnoreFile('xyz'))
	//
	//	// regexp
	//	var config = WatcherConfig.create({ignoreOnFileRelativePath: /abc/})
	//	assert.ok(config.isIgnoreFile({fileRelativePath: 'dir/abc/xyz'}))
	//
	//	// regexp array
	//	var config = WatcherConfig.create({ignoreOnFileRelativePath: [/abc/, /xyz/]})
	//	assert.ok(config.isIgnoreFile({fileRelativePath: 'xyz/123'}))
	//
	//	// function
	//	var config = WatcherConfig.create({
	//		ignoreOnFileRelativePath: function (info) {
	//			return !!info.fileRelativePath.match(/123/)
	//		}
	//	})
	//	assert.ok(config.isIgnoreFile({fileRelativePath: 'xyz/123'}))
	//
	//	// function but throw error
	//	var config = WatcherConfig.create({
	//		ignoreOnFileRelativePath: function () {
	//			throw new Error('test error')
	//		}
	//	})
	//	assert.ok(!config.isIgnoreFile({fileRelativePath: 'abc'}))
	//
	//	// wrong type
	//	var config = WatcherConfig.create({ignoreOnFileRelativePath: 'abc'})
	//	assert.ok(!config.isIgnoreFile({fileRelativePath: 'abc'}))
	//})
})