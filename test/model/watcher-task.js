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

		// String
		var t = WatcherTask.create({matchOnFileRelativePath: '*.js'})
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'ab.js'}))
		assert.ok(!t.isMatchOnFileRelativePath({fileRelativePath: 'ab.jade'}))

		// Array<Regexp, String>
		var t = WatcherTask.create({
			matchOnFileRelativePath: [
				/abc/,
				/xyz/,
				'**/*.xy'
			]
		})
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'abc'}))
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'xyz'}))
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'abc/xyz'}))
		assert.ok(t.isMatchOnFileRelativePath({fileRelativePath: 'xx.xy'}))

		// Function
		var t = WatcherTask.create({
			matchOnFileRelativePath: function (info) {
				return info == 1
			}
		})
		assert.ok(!t.isMatchOnFileRelativePath(0))
		assert.ok(t.isMatchOnFileRelativePath(1))
		assert.ok(!t.isMatchOnFileRelativePath(2))

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

		// String with marco
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

		// Function throw error
		var t = WatcherTask.create({
			arguments: function () {
				throw new Error('test error')
			}
		})
		assert.equal(t.arguments(), '')
	})

	it('outputPath()', function () {
		// undefined/default
		var t = WatcherTask.create()
		assert.equal(t.outputPath({filePath: 'test.js'}), 'test.js.output')

		// String
		var t = WatcherTask.create({outputPath: '123'})
		assert.equal(t.outputPath({projectPath: '/a/b'}), '/a/b/123')

		// String with marco
		var t = WatcherTask.create({outputPath: '${filePath}.test'})
		assert.equal(t.outputPath({filePath: 'abc', projectPath: '/a'}), '/a/abc.test')

		// Empty-String
		var t = WatcherTask.create({outputPath: ''})
		assert.equal(t.outputPath({filePath: '/x/test.js'}), '/x/test.js.output')

		// Function return relative path
		var t = WatcherTask.create({
			outputPath: function (info) {
				return info.x
			}
		})
		assert.equal(t.outputPath({x: 'test', projectPath: '/a'}), '/a/test')

		// Function return absolute path
		var t = WatcherTask.create({
			outputPath: function (info) {
				return info.x
			}
		})
		assert.equal(t.outputPath({x: '/a/test'}), '/a/test')


		// Function throw error
		var t = WatcherTask.create({
			outputPath: function () {
				throw 'test error'
			}
		})
		assert.equal(t.outputPath({filePath: '/a/test.js'}), '/a/test.js.output')
	})


	it('dependFiles()', function () {
		// undefined/default
		var t = WatcherTask.create()
		assert.deepEqual(t.dependFiles(), [])

		//// String of absolutePath
		//var t = WatcherTask.create({dependFiles: '/a/b'})
		//assert.deepEqual(t.dependFiles({dirPath: '/a'}), ['b']) // todo, String不支持了, 应当删去

		//// String of relativePath
		//var t = WatcherTask.create({dependFiles: 'xyz/abc'})
		//assert.deepEqual(t.dependFiles({}), ['xyz/abc'])

		// Regexp of relativePath
		var t = WatcherTask.create({dependFiles: /include ([^\r\n]+)/g})
		assert.deepEqual(t.dependFiles({
			dirRelativePath  : 'dir',
			fileAllExtensions: '.jade',
			fileContent      : 'include abc\ninclude xyz'
		}), ['dir/abc.jade', 'dir/xyz.jade'])

		// Complex
		var t = WatcherTask.create({
			dependFiles: {
				match    : [
					[/(include) ([a-z]+)/g, 2]
				],
				onProcess: function (path) {
					return path + '.js'
				}
			}
		})
		assert.deepEqual(t.dependFiles({
			fileContent: 'include abc\ninclude xyz'
		}), ['abc.js', 'xyz.js'])
	})

})