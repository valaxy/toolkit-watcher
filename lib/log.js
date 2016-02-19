var winston = require('winston')
var getlog = require('log/lib/get-log')
var _ = require('underscore')

require('colors')
var logger = new (winston.Logger)({
	transports: [],
	colorize  : true
})

winston.addColors({
	info : 'green',
	warn : 'yellow',
	error: 'red',
	debug: 'cyan'
})


module.exports = {
	get: function () {
		return this
	},

	openConsole: function () {
		logger.add(winston.transports.Console, {
			colorize : true,
			level    : 'debug',
			showLevel: false
		})
		return this.get()
	},

	_log: function (tag, indent) {
		if (_.isNumber(indent)) {
			var tags = tag ? [tag] : []
			var args = [{
				tags  : tags,
				indent: indent
			}]
			args = args.concat(Array.prototype.slice.call(arguments, 2))
		} else {
			var tags = tag ? [tag] : []
			var args = [{
				tags  : tags,
				indent: indent
			}]
			args = args.concat(Array.prototype.slice.call(arguments, 1))
		}
		return getlog.apply(getlog, args)
	},

	info: function () {
		arguments[0] = arguments[0] ? arguments[0].green : ''
		logger.info(this._log.apply(this, arguments))
	},

	debug: function () {
		arguments[0] = arguments[0] ? arguments[0].cyan : ''
		logger.debug(this._log.apply(this, arguments))
	},

	error: function () {
		arguments[0] = arguments[0] ? arguments[0].red : ''
		logger.error(this._log.apply(this, arguments))
	},

	warn: function () {
		arguments[0] = arguments[0] ? arguments[0].yellow : ''
		logger.warn(this._log.apply(this, arguments))
	}
}