var _ = require('underscore')

module.exports = function (options) {
	return _.extend(options, {
		dependFiles: [
			/@import\s+"([^\r\n\s]+)"/g
		]
	})
}