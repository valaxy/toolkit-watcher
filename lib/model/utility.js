var _         = require('underscore'),
    logger    = require('../log').get(),
    path      = require('path'),
    minimatch = require('minimatch')


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

	normalizePath: function (p) {
		return p.replace(/\\/g, '/')
	},

	isStringOrRegexp: function (value) {
		return _.isString(value) || _.isRegExp(value)
	},

	isNonEmptyString: function (value) {
		return _.isString(value) && value !== ''
	},

	trycatch: function (fn, defaultValue) {
		try {
			return fn()
		} catch (e) {
			if (e instanceof Error) {
				logger.error(e.stack)
			} else {
				logger.error(String(e))
			}
			return defaultValue()
		}
	},

	// test with Glob or RegExp
	testOnceAtLeast: function (testValue, rules) {
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i]
			if (_.isString(rule)) {
				if (minimatch(testValue, rule)) {
					return true
				}
			} else { // RegExp
				if (rule.test(testValue)) {
					return true
				}
			}
		}
		return false
	}

}