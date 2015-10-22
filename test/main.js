var assert = require('assert'),
    main   = require('../lib/main'),
    fs     = require('fs-extra'),
    temp   = require('temp'),
    path   = require('path')


var getScript = function (fn, paras) {
	var REG = /^function\s+\([^\)]*\)\s+\{([\s\S]*?)}$/
	var match = fn.toString().match(REG)
	var code = match[1]
	paras = paras || {}
	for (var key in paras) {
		var value = paras[key]
		while (code.indexOf(key) >= 0) {
			code = code.replace(key, value)
		}
	}
	return code
}

require('colors')
describe('main', function () {
	it('case1', function () {
		var dir = temp.mkdirSync()
		fs.mkdirs(path.join(dir, '.toolbox'))
		fs.outputFileSync(path.join(dir, '.toolbox/watcher.js'), getScript(function () {
			module.exports = {
				ignoreOnFileRelativePath: /^excludes(\/.*)?$/,
				tasks                   : [
					{
						isEnabled              : true,
						description            : '编译JADE',
						program                : 'jade',
						arguments              : [
							'--out $DirPath',
							'$FilePath'
						],
						matchOnFileRelativePath: /\.jade$/
					},
					{
						isEnabled              : true,
						description            : '编译SCSS',
						program                : 'sass',
						arguments              : [
							'--sourcemap=none',
							'--no-cache',
							'$FilePath',
							'${DirPath}/${FileNameWithoutAllExtensions}.css'
						],
						matchOnFileRelativePath: /\.scss$/
					}
				]
			}
		}))
		main({
			project: dir
		})
		assert.ok(true)
	})
})