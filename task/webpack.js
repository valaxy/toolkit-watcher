var _    = require('underscore'),
    path = require('path')


module.exports = function (options) {
	return _.extend(options, {
		program    : 'webpack',
		dependFiles: {
			match    : [
				/require\("([^"]+)"\)/g,
				/require\('([^']+)'\)/g
			],
			onProcess: function (masterPath, info) {
				return path.join(info.dirRelativePath, masterPath + '.js')
			}
		}
	})
}