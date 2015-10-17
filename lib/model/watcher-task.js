var _       = require('underscore'),
    utility = require('./utility'),
    logger  = require('../log').get()


var WatcherTask = {
	create: function (config) {
		var obj = Object.create(this)
		obj._config = config || {}
		obj._buildConfig('isEnabled')
		obj._buildConfig('matchOnFileRelativePath')
		obj._buildConfig('program')
		obj._buildConfig('arguments')
		return obj
	},

	_buildConfig: function (key) {
		this._config[key] = this['_' + key](this._config[key])
	},

	/** default is false */
	_isEnabled: function (isEnabled) {
		if (_.isFunction(isEnabled)) {
			return isEnabled
		}

		if (_.isUndefined(isEnabled)) {
			return false
		}

		if (_.isBoolean(isEnabled)) {
			return isEnabled
		}

		logger.warn('isEnabled can only be Undefined, Boolean, or Function')
		return false
	},

	isEnabled: function () {
		var isEnabled = this._config.isEnabled

		if (_.isFunction(isEnabled)) {
			try {
				return !!isEnabled()
			} catch (e) {
				logger.error(e.stack) // todo, e有可能不是Error类型
				return false
			}
		} else {
			return isEnabled
		}
	},

	/** at least match one */
	_matchOnFileRelativePath: function (matchOnFileRelativePath) {
		if (_.isFunction(matchOnFileRelativePath)) {
			return matchOnFileRelativePath
		}

		if (_.isUndefined(matchOnFileRelativePath)) {
			return []
		}

		if (_.isRegExp(matchOnFileRelativePath)) {
			return [matchOnFileRelativePath]
		}

		if (utility.isArrayContains(matchOnFileRelativePath, _.isRegExp)) {
			return matchOnFileRelativePath
		}

		logger.warn('matchOnFileRelativePath can only be Undefined, RegExp, Array<RegExp> or Function')
		return []
	},

	isMatchOnFileRelativePath: function (info) { // todo, 感觉MatchOnFileRelativePath命名不太科学, 当是自定义Function的时候
		var match = this._config.matchOnFileRelativePath

		if (_.isFunction(match)) {
			try {
				return match(info)
			} catch (e) {
				logger.error(e.stack)
				return false
			}
		} else {
			var fileRelativePath = info.fileRelativePath
			for (var i = 0; i < match.length; i++) {
				if (match[i].test(fileRelativePath)) {
					return true
				}
			}
			return false
		}
	},

	_program: function (program) {
		if (_.isFunction(program)) {
			return program
		}

		if (_.isString(program)) {
			return program
		}

		logger.error('program must be non-empty-String or Function')

		return function () {
			// empty function
		}
	},

	program: function () {
		return this._config.program
	},

	_arguments: function (arguments) {
		if (_.isFunction(arguments)) {
			return arguments
		}

		if (_.isUndefined(arguments)) {
			return ''
		}

		if (_.isString(arguments)) {
			return arguments
		}

		if (utility.isArrayContains(arguments, _.isString)) {
			return arguments.join(' ')
		}

		logger.warn('arguments can only be Undefined, String, Array<String>, or Function')
		return ''
	},

	arguments: function (info) {
		var arguments = this._config.arguments
		if (_.isFunction(arguments)) {
			try {
				return String(arguments(info))
			} catch (e) {
				logger.error(e.stack)
				return ''
			}
		} else {
			return arguments
		}
	}
}

module.exports = WatcherTask
