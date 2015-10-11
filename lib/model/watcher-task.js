var _       = require('underscore'),
    utility = require('./utility')


var WatcherTask = {
	create: function (config) {
		var obj = Object.create(this)
		obj._config = config || {}
		return obj
	},

	isEnabled: function () {
		var isEnabled = this._config.isEnabled

		if (_.isUndefined(isEnabled)) {
			return false
		}

		if (_.isFunction(isEnabled)) {
			isEnabled = isEnabled()
		}

		if (_.isBoolean(isEnabled)) {
			return isEnabled
		}

		console.warn('isEnabled can only be Boolean, or Function return Boolean')
		return false
	},

	matchOnfileRelativePath: function () {
		var matchOnfileRelativePath = this._config.matchOnfileRelativePath

		if (_.isFunction(matchOnfileRelativePath)) {
			matchOnfileRelativePath = value()
		}

		if (_.isUndefined(matchOnfileRelativePath)) {
			return
		}

		if (_.isRegExp(matchOnfileRelativePath)) {
			return matchOnfileRelativePath
		}

		console.warn('matchOnfileRelativePath can only be Undefined, RegExp, or Function return above')
		return
	},

	isMatchOnfileRelativePath: function (fileRelativePath) {
		var regexp = this.matchOnfileRelativePath()
		return regexp && regexp.test(fileRelativePath)
	},

	program: function () {
		return this._config.program
	},

	arguments: function () {
		var arguments = this._config.arguments

		if (_.isUndefined(arguments)) {
			return ''
		}

		if (_.isFunction(arguments)) {
			arguments = arguments()
		}

		if (_.isString(arguments)) {
			return arguments
		}

		if (utility.isArrayContains(arguments, _.isString)) {
			return arguments.join(' ')
		}


		console.warn('arguments can only be String, Array of String, or Function return above')
		return ''
	}
}

module.exports = WatcherTask


//module.exports = {
//	_convertArguments: function (value) {
//
//	},
//
//	// FileNameMatch
//	// FilePathMatch
//	_convertMatch: function (value) {
//
//	},
//
//
//	convert: function (config) {
//		config.filePathExcludes = this._convertExcludes(config.filePathExcludes)
//		return config
//	}
//}