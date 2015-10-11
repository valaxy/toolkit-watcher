var chokidar = require('chokidar'),
    path     = require('path'),
    reload   = require('require-reload')(require)

/**
 * Watch only for config file
 */

module.exports = {
	init: function (projectWatcher) {
		this._configPath = path.join(projectWatcher.root(), '.toolbox/watcher.js')
		this._projectWatcher = projectWatcher
	},

	_on: function (event) {
		return function () {
			console.info('watcher config'.cyan, event)

			try {
				var watcherConfig = reload(this._configPath)
			} catch (e) {
				console.error('error'.red, 'watcher config reload error, maybe syntax error')
				return
			}

			this._projectWatcher.watcherConfig(watcherConfig)
		}.bind(this)
	},

	start: function () {
		this._watcher = chokidar.watch(this._configPath)
			.on('change', this._on.call(this, 'change'))
			.on('add', this._on.call(this, 'add'))
	},

	stop: function () {
		this._watcher.close()
		this._watcher.unwatch(this._configPath)
	}
}