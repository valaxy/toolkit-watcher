var _ = require('underscore')

module.exports = function (options) {
	return _.extend(options, {
		program    : 'webpack',
		dependFiles: [
			/require\("([^"]+)"\)/g,
			/require\('([^']+)'\)/g
		]
	})
}