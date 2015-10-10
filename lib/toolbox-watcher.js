var chokidar = require('chokidar'),
    path     = require('path'),
    reload   = require('require-reload')(require)


module.exports = {
	init: function (projectWatcher) {
		this._configPath = path.join(projectWatcher.root(), '.toolbox/watcher.js')
		this._projectWatcher = projectWatcher
	},

	_on: function () {
		console.log('watcher config add or change')

		try {
			var watcherConfig = reload(this._configPath)
		} catch (e) {
			console.log('watcher config reload error, maybe syntax error')
			return
		}

		this._projectWatcher.watcherConfig(watcherConfig)
		this._projectWatcher.restart()
	},

	start: function () {
		this._watcher = chokidar.watch(this._configPath)
			.on('change', this._on.bind(this))
			.on('add', this._on.bind(this))
	},

	stop: function () {
		this._watcher.close()
		this._watcher.unwatch(this._configPath)
	}
}