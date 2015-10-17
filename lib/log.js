var winston = require('winston')

var logger = new (winston.Logger)({
	transports: []
})

module.exports = {
	get: function () {
		return logger
	},

	openConsole: function () {
		logger.transports.add(new (winston.transports.Console)())
	}
}