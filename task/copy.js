var _    = require('underscore'),
    path = require('path'),
    fs   = require('fs')


module.exports = function (options) {
	return _.extend(options, {
		program: function (info) {
			return fs.readFileSync(info.filePath)
		}
	})
}