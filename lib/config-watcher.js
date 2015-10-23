var chokidar                = require('chokidar'),
    path                    = require('path'),
    reload                  = require('require-reload')(require),
    logger                  = require('./log').get(),
    _                       = require('underscore'),
    WatcherConfigCollection = require('./model/watcher-config-collection')


/**
 * Watch only for config file
 */

var CONFIG_DIR = '.toolkit'

module.exports = {
	init: function (projectWatcher) {
		this._config = WatcherConfigCollection.create()
		this._configPath = path.join(projectWatcher.root(), CONFIG_DIR)
		this._projectWatcher = projectWatcher
	},

	_onChangeAdd: function (event) {
		return function (absolutePath) {
			logger.info('config', event, absolutePath)

			try {
				var watcherConfig = reload(absolutePath)
				this._config.add(absolutePath, watcherConfig)
			} catch (e) {
				logger.error('config', 'reload error')
				return
			}

			this._projectWatcher.watcherConfig(this._config.toJSON())
		}.bind(this)
	},

	_onDelete: function (absolutePath) {
		logger.info('config', 'delete', absolutePath)
		this._config.remove(absolutePath)
		this._projectWatcher.watcherConfig(this._config.toJSON())
	},

	start: function (ready) {
		this._watcher = chokidar.watch(this._configPath, {
			ignored: function (absolutePath) {
				var relativePath = path.relative(this._projectWatcher.root(), absolutePath)
				return !(/^\.toolkit$/.test(relativePath) || /\.watcher\.js$/.test(absolutePath))
			}.bind(this)
		})
			.on('ready', function () {
				logger.info('config', 'scan over')
				ready()
			})
			.on('change', this._onChangeAdd.call(this, 'change'))
			.on('add', this._onChangeAdd.call(this, 'add'))
			.on('delete', this._onDelete.bind(this))
	},

	stop: function () {
		this._watcher.close()
		this._watcher.unwatch(this._configPath)
	}
}