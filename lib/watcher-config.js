var _ = require('underscore')

// `ary` is Array and all elements match `isFunction`
var isArrayMatch = function (ary, isFunction) {
	if (!_.isArray(ary)) {
		return false
	}

	for (var i = 0; i < ary.length; i++) {
		if (!isFunction(ary[i])) {
			return false
		}
	}

	return true
}

module.exports = {
	_convertArguments: function (value) {
		if (_.isFunction(value)) {
			value = value()
		}

		if (isArrayMatch(value, _.isString)) {
			return value.join(' ')
		}

		if (_.isString(value)) {
			return value
		}

		throw new Error('value can only be String, Array of String, or Function return above')
	},

	// FileNameMatch
	// FilePathMatch
	_convertMatch: function (value) {
		if (_.isFunction(value)) {
			value = value()
		}

		if (_.isRegExp(value)) {
			return value
		}

		throw new Error('value can only be RegExp, or Function return RegExp')
	},

	_convertExcludes: function (value) {
		if (_.isUndefined(value)) {
			return []
		}

		if (_.isFunction(value)) {
			value = value()
		}

		if (_.isRegExp(value)) {
			return [value]
		}

		if (isArrayMatch(value, _.isRegExp)) {
			return value
		}


		throw new Error('value can only be RegExp, Array of RegExp, or Function return above')
	},

	convertWatcherConfig: function (config) {
		config.filePathExcludes = this._convertExcludes(config.filePathExcludes)
		return config
	},

	default: function () {
		return this.convertWatcherConfig({
			version: '0.0.0',
			tasks  : []
		})
	}
}