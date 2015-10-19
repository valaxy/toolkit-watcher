var _ = require('underscore')

var WatcherConfigCollection = {
	create: function () {
		var obj = Object.create(this)
		obj._map = {}
		return obj
	},

	add: function (path, config) {
		this._map[path] = config
	},

	remove: function (path) {
		delete this._map[path]
	},

	count: function () {
		return _.keys(this._map).length
	},

	toJSON: function () {
		var config = {
			matchOnFileRelativePath : [],
			ignoreOnFileRelativePath: [],
			tasks                   : []
		}
		for (var path in this._map) {
			var newConfig = this._map[path]
			config.ignoreOnFileRelativePath = _.union(config.ignoreOnFileRelativePath, newConfig.ignoreOnFileRelativePath)
			config.matchOnFileRelativePath = _.union(config.matchOnFileRelativePath, newConfig.matchOnFileRelativePath)
			config.tasks = _.union(config.tasks, newConfig.tasks)
		}
		return config
	}
}

module.exports = WatcherConfigCollection