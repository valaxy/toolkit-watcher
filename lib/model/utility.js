var _      = require('underscore'),
    logger = require('../log').get()

module.exports = {
	/** `ary` is Array and all elements match `isFunction` */
	isArrayContains: function (ary, isFunction) {
		if (!_.isArray(ary)) {
			return false
		}

		for (var i = 0; i < ary.length; i++) {
			if (!isFunction(ary[i])) {
				return false
			}
		}

		return true
	},

	isStringOrRegexp: function (value) {
		return _.isString(value) || _.isRegExp(value)
	},

	trycatch: function (fn, defaultValue) {
		try {
			return fn()
		} catch (e) {
			if (e instanceof  Error) {
				logger.error(e.stack)
			} else {
				logger.error(String(e))
			}
			return defaultValue()
		}
	}
}