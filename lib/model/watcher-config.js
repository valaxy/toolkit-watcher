var _           = require('underscore'),
    utility     = require('./utility'),
    WatcherTask = require('./watcher-task'),
    logger      = require('../log').get()


var WatcherConfig = {
	create: function (config) {
		var obj = Object.create(WatcherConfig)
		obj._config = config || {tasks: []}
		obj._config.tasks = _.map(obj._config.tasks, function (task) {
			return WatcherTask.create(task)
		})
		obj._buildConfig('ignoreOnFileRelativePath')
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
		if (_.isFunction(ignore)) {
			return ignore
		}

		if (_.isUndefined(ignore)) {
			return []
		}

		if (_.isRegExp(ignore)) {
			return [ignore]
		}

		if (utility.isArrayContains(ignore, _.isRegExp)) {
			return ignore
		}

		logger.warn('ignoreOnFileRelativePath can only be RegExp, Array<RegExp>, or Function')
		return []
	},

	isIgnoreFile: function (info) {
		var ignore = this._config.ignoreOnFileRelativePath
		if (_.isFunction(ignore)) {
			try {
				return ignore(info)
			} catch (e) {
				logger.error(e.stack)
				return false
			}
		} else {
			var fileRelativePath = info.fileRelativePath
			for (var i = 0; i < ignore.length; i++) {
				if (ignore[i].test(fileRelativePath)) {
					return true
				}
			}
			return false
		}
	}
}

module.exports = WatcherConfig
