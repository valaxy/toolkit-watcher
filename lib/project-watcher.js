var chokidar     = require('chokidar'),
    path         = require('path'),
    _            = require('underscore'),
    velocityjs   = require('velocityjs'),
    childProcess = require('child_process')


var executeProgram = function (p, event) {
	var watchers = this._watcherConfig
	var dict = {
		FileName                : path.basename(p),
		FileExtension           : path.extname(p),
		FileNameWithoutExtension: path.basename(p, path.extname(p)),

		FilePath: p,
		FileDir : path.dirname(p),
	}

	watchers.forEach(function (watcher) {
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
		this._watcherConfig = []
		this._watcher = null
	},

	start: function () {
		console.log('start project watcher')

		this._watcher = chokidar.watch(this._root, {
			ignored: /\.toolbox/
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
			this._watcherConfig = value
		}
	}
}