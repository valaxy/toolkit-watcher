var _           = require('underscore'),
    u           = require('./utility'),
    WatcherTask = require('./watcher-task'),
    logger      = require('../log').get(),
    minimatch   = require('minimatch')


// test with Glob or RegExp
var testOnceAtLeast = function (testValue, rules) {
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


var WatcherConfig = {
	create: function (config) {
		var obj = Object.create(WatcherConfig)
		obj._config = config || {tasks: []}
		obj._config.tasks = _.map(obj._config.tasks, function (task) {
			return WatcherTask.create(task)
		})
		obj._buildConfig('ignoreOnFileRelativePath')
		obj._buildConfig('matchOnFileRelativePath')
		return obj
	},

	_buildConfig: function (key) {
		this._config[key] = this['_' + key](this._config[key])
	},

	createDefault: function () {
		return this.create({
			tasks: []
		})
	},

	tasks: function () {
		return this._config.tasks
	},


	_ignoreOnFileRelativePath: function (ignore) {
		if (_.isUndefined(ignore)) return []
		if (_.isString(ignore)
			|| _.isRegExp(ignore)) return [ignore]
		if (u.isArrayContains(ignore, u.isStringOrRegexp)
			|| _.isFunction(ignore)) return ignore

		logger.warn('ignoreOnFileRelativePath must be Undefined, String, RegExp, Array<String|RegExp>, or Function')
		return []
	},

	_matchOnFileRelativePath: function (match) {
		if (_.isUndefined(match)) return []
		if (_.isString(match)
			|| _.isRegExp(match)) return [match]
		if (u.isArrayContains(match, u.isStringOrRegexp)
			|| _.isFunction(match)) return match

		logger.warn('matchOnFileRelativePath must be Undefined, String, RegExp, Array<String|RegExp> or Function')
		return []
	},

	isMatchFile: function (info) {
		var match = this._config.matchOnFileRelativePath

		if (_.isFunction(match)) {
			var isMatch = u.trycatch(
				function () {
					return match(info)
				},
				function () {
					return false
				}
			)
		} else {
			var isMatch = testOnceAtLeast(info.fileRelativePath, match)
		}

		if (!isMatch) {
			return false
		}

		// match and not ignore
		var ignore = this._config.ignoreOnFileRelativePath

		if (_.isFunction(ignore)) {
			var isIgnore = u.trycatch(
				function () {
					return ignore(info)
				},
				function () {
					return false
				}
			)
		} else {
			var isIgnore = testOnceAtLeast(info.fileRelativePath, ignore)
		}
		return !isIgnore
	}
}

module.exports = WatcherConfig
