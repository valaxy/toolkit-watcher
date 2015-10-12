var _       = require('underscore'),
    utility = require('./utility')


var WatcherTask = {
	create: function (config) {
		var obj = Object.create(this)
		obj._config = config || {}
		return obj
	},

	/** default is false */
	isEnabled: function () {
		var isEnabled = this._config.isEnabled

		if (_.isFunction(isEnabled)) {
			isEnabled = isEnabled()
		}

		if (_.isUndefined(isEnabled)) {
			return false
		}

		if (_.isBoolean(isEnabled)) {
			return isEnabled
		}

		console.warn('isEnabled can only be Undefined, Boolean, or Function return above')
		return false
	},

	/** at least match one */
	matchOnFileRelativePath: function () {
		var matchOnFileRelativePath = this._config.matchOnFileRelativePath

		if (_.isFunction(matchOnFileRelativePath)) {
			matchOnFileRelativePath = matchOnFileRelativePath()
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

		console.warn('matchOnFileRelativePath can only be Undefined, RegExp, Array<RegExp> or Function return above')
		return []
	},

	isMatchOnFileRelativePath: function (fileRelativePath) {
		var regexps = this.matchOnFileRelativePath()
		for (var i = 0; i < regexps.length; i++) {
			if (regexps[i].test(fileRelativePath)) {
				return true
			}
		}
		return false
	},

	program: function () {
		var program = this._config.program

		//if (_.isFunction(program)) {
		//	program = program
		//}

		if (_.isString(program)) {
			return program
		}

		console.warn('program can only be String')
		return ""
	},

	arguments: function () {
		var arguments = this._config.arguments

		if (_.isFunction(arguments)) {
			arguments = arguments()
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


		console.warn('arguments can only be Undefined, String, Array<String>, or Function return above')
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