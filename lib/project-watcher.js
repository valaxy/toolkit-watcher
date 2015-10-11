var chokidar      = require('chokidar'),
    path          = require('path'),
    _             = require('underscore'),
    velocityjs    = require('velocityjs'),
    childProcess  = require('child_process'),
    marco         = require('./marco'),
    WatcherConfig = require('./model/watcher-config')


var executeProgram = function (p, event) { // todo, p不是绝对路径
	var watcherTasks = this._watcherConfig.tasks()
	var dict = marco(p, this._root)

	watcherTasks.forEach(function (watcherTask) {
		var argString = velocityjs.render(watcherTask.arguments(), dict)
		var cmd = watcherTask.program() + ' ' + argString

		//(!watcherTask.fileExtension || watcherTask.fileExtension == dict.FileExtension) &&
		//(!watcherTask.fileNameMatch || watcherTask.fileNameMatch.test(dict.FileName)) &&
		if (watcherTask.isEnabled() && watcherTask.isMatchOnfileRelativePath(dict.FilePathRelativeToProjectRoot)) {
			childProcess.exec(cmd)
			console.log('program', cmd)
		}
	})
}


module.exports = {
	init: function (root) {
		this._root = root
		this._watcherConfig = WatcherConfig.createDefault()
		this._watcher = null
	},

	start: function () {
		console.log('start project watcher')

		this._watcher = chokidar.watch(this._root, {
			ignored: function (fileAbsoultePath) {
				var fileRelativePath = path.relative(this._root, fileAbsoultePath)
				return this._watcherConfig.fileIsExclude(fileRelativePath)
			}.bind(this) ///\.toolbox/
		})
			.on('add', function (path, event) {
				console.log('add', path)
				executeProgram.call(this, path, event)
			}.bind(this))
			.on('change', function (path, event) {
				console.log('change', path)
				executeProgram.call(this, path, event)
			}.bind(this))
	},

	stop: function () {
		console.log('stop project watcher')
		this._watcher.close()
		this._watcher.unwatch(this._root)
	},

	restart: function () {
		this.stop()
		this.start()
	},

	root: function () {
		return this._root
	},

	watcherConfig: function (value) {
		if (value === undefined) {
			return this._watcherConfig
		} else {
			console.log('reload watch config')
			this._watcherConfig = WatcherConfig.create(value)
		}
	}
}