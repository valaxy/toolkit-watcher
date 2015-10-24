var _    = require('underscore'),
    path = require('path')


module.exports = function (options) {
	return _.extend(options, {
		dependFiles: [
			/\s*include\s+([^\r\n\s]+)/g,
			/\s*extends\s+([^\r\n\s]+)/g
		]
	})
}