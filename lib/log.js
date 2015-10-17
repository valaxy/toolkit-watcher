var winston = require('winston')

var logger = new (winston.Logger)({
	transports: []
})

module.exports = {
	get: function () {
		return logger
	},

	openConsole: function () {
		logger.add(winston.transports.Console)
		return this.get()
	}
}