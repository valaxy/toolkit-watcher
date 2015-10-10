var chokidar      = require('chokidar'),
    path          = require('path'),
    _             = require('underscore'),
    velocityjs    = require('velocityjs'),
    childProcess  = require('child_process'),
    marco         = require('./marco'),
    watcherConfig = require('./watcher-config')


var executeProgram = function (p, event) { // todo, p不是绝对路径
	var watcherTasks = this._watcherConfig.tasks
	var dict = marco(p, this._root)

	watcherTasks.forEach(function (watcher) {
		var args = _.map(watcher.arguments, function (arg) {
			return velocityjs.render(arg, dict)
		})
		var cmd = watcher.program + ' ' + args.join(' ')

		if (watcher.isEnabled &&
			(!watcher.fileExtension || watcher.fileExtension == dict.FileExtension) &&
			(!watcher.fileNameMatch || watcher.fileNameMatch.test(dict.FileName)) &&
			(!watcher.filePathMatch || watcher.filePathMatch.test(dict.FilePath))) {
			childProcess.exec(cmd)
			console.log('program', cmd)
		}
	})
}


module.exports = {
	init: function (root) {
		this._root = root
		this._watcherConfig = watcherConfig.default()
		this._watcher = null
	},

	start: function () {
		console.log('start project watcher')
		var excludes = this._watcherConfig.filePathExcludes

		this._watcher = chokidar.watch(this._root, {
			ignored: function (fileAbsoultePath) {
				var fileRelativePath = path.relative(this._root, fileAbsoultePath)
				for (var i = 0; i < excludes.length; i++) {
					if (excludes[i].test(fileRelativePath)) {
						return true
					}
				}
				return false
			}.bind(this)///\.toolbox/
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
			value = watcherConfig.convertWatcherConfig(value)
			this._watcherConfig = value
		}
	}
}