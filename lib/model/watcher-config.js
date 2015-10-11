var _           = require('underscore'),
    utility     = require('./utility'),
    WatcherTask = require('./watcher-task')


var WatcherConfig = {
	create: function (config) {
		var obj = Object.create(WatcherConfig)
		obj._config = config || {tasks: []}
		obj._config.tasks = _.map(obj._config.tasks, function (task) {
			return WatcherTask.create(task)
		})
		return obj
	},

	createDefault: function () {
		return this.create({
			version: '0.0.0',
			tasks  : []
		})
	},

	tasks: function () {
		return this._config.tasks
	},

	excludesOnFileRelativePath: function () {
		var excludes = this._config.excludesOnFileRelativePath

		if (_.isUndefined(excludes)) {
			return []
		}

		if (_.isFunction(excludes)) { // todo, may throw
			excludes = excludes()
		}

		if (_.isRegExp(excludes)) {
			return [excludes]
		}

		if (utility.isArrayContains(excludes, _.isRegExp)) {
			return excludes
		}


		console.warn('excludesOnFileRelativePath can only be RegExp, Array of RegExp, or Function return above')
		return []
	},

	fileIsExclude: function (fileRelativePath) {
		var excludes = this.excludesOnFileRelativePath()
		for (var i = 0; i < excludes.length; i++) {
			if (excludes[i].test(fileRelativePath)) {
				return true
			}
		}

		return false
	}
}

module.exports = WatcherConfig


//toPureObject: function () {
//	return {
//		excludesOnFileRelativePath: this.excludesOnFileRelativePath(),
//		tasks                     : this._config.tasks
//	}
//}


