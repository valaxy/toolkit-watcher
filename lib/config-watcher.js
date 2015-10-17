var chokidar = require('chokidar'),
    path     = require('path'),
    reload   = require('require-reload')(require),
    logger   = require('./log').get()

/**
 * Watch only for config file
 */

var CONFIG_PATH = '.toolkit/watcher.js'

module.exports = {
	init: function (projectWatcher) {
		this._configPath = path.join(projectWatcher.root(), CONFIG_PATH)
		this._projectWatcher = projectWatcher
	},

	_on: function (event) {
		return function () {
			logger.info('watcher config'.cyan, event)

			try {
				var watcherConfig = reload(this._configPath)
			} catch (e) {
				logger.error('error'.red, 'watcher config reload error, maybe syntax error')
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