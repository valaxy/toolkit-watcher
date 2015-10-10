var _ = require('underscore')

module.exports = {
	_convertArguments: function (value) {
		if (_.isFunction(value)) {
			value = value()
		}

		if (_.isArray(value)) {
			return value.join(' ')
		}

		if (_.isString(value)) {
			return value
		}

		throw new Error('value can only be Function, Array, String')
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

		throw new Error('value can only be Function, RegExp')
	}
}