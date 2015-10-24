var _    = require('underscore'),
    path = require('path')


module.exports = function (options) {
	_.extend(options, {
		dependFiles: function (info) {
			var code = info.fileContent
			var result = []

			// include
			var INCLUDE_REG = /\s*include\s+([^\r\n\s]+)/g
			while (true) {
				var match = INCLUDE_REG.exec(code)
				if (!match) break
				result.push(path.join(info.dirRelativePath, match[1] + info.fileAllExtensions))
			}

			// extend
			var EXTENDS_REG = /\s*extends\s+([^\r\n\s]+)/g
			while (true) {
				var match = EXTENDS_REG.exec(code)
				if (!match) break
				result.push(path.join(info.dirRelativePath, match[1] + info.fileAllExtensions))
			}

			return result
		}
	})

	return options
}