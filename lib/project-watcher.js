var chokidar      = require('chokidar'),
    path          = require('path'),
    _             = require('underscore'),
    fs            = require('fs-extra'),
    marco         = require('./marco'),
    WatcherConfig = require('./model/watcher-config'),
    logger        = require('./log').get(),
    FileGraph     = require('./file-graph'),
    u             = require('./model/utility'),
    executeTask   = require('./task/execute')


var executeProgram = function (fileAbsolutePath, stats, event) { // todo, fileAbsolutePath有时不是绝对路径
	var watcherTasks = this._watcherConfig.tasks()
	var info = marco(fileAbsolutePath, this.root())

	watcherTasks.forEach(function (watcherTask) {
		if (!watcherTask.isEnabled()) {
			return
		}

		// execute current file
		executeTask(watcherTask, info)

		var dependFiles = watcherTask.dependFiles(info)
		dependFiles = _.map(dependFiles, function (dependFile) {
			return u.normalizePath(dependFile)
		})
		//console.log(dependFiles)

		if (event == 'add') {
			this._fileGraph.onAddFile(info.fileRelativePath, dependFiles)
		} else { // change
			this._fileGraph.onChangeFile(info.fileRelativePath, dependFiles)
		}

		// execute depended files
		//console.log(info.fileRelativePath, this._fileGraph.getFilesUsed(info.fileRelativePath))
		this._fileGraph.getFilesUsed(info.fileRelativePath).forEach(function (usedFile) {
			//console.log(usedFile)
			var absolutePath2 = path.join(this.root(), usedFile)
			if (fs.existsSync(absolutePath2)) {
				var info2 = marco(absolutePath2, this.root()) // todo, 重构: 使用relativePath构造
				executeTask(watcherTask, info2, 1)
			}
		}.bind(this))
	}.bind(this))
}

var onFileAdd = function (absolutePath, stats) {
	executeProgram.call(this, absolutePath, stats, 'add')
}


var onFileChange = function (absolutePath, event) {
	executeProgram.call(this, absolutePath, event, 'change')
}


module.exports = {
	init: function (root) {
		this._root = u.normalizePath(root)
		this._watcherConfig = WatcherConfig.createDefault()
		this._watcher = null
		this._fileGraph = FileGraph.create()
	},

	start: function () {
		logger.info('watcher', 'start at', this.root())

		this._watcher = chokidar.watch(this._root, {
			ignored: function (fileAbsoultePath) {
				var fileRelativePath = path.relative(this._root, fileAbsoultePath)
				if (fileRelativePath == '') { // root of project
					return false
				}
				if (/^\.toolkit/.test(fileRelativePath)) { // root of toolkit
					return true
				}
				return !this._watcherConfig.isMatchFile({
					fileRelativePath: fileRelativePath
				})
			}.bind(this)
		})
			.on('add', onFileAdd.bind(this))
			.on('change', onFileChange.bind(this))
			.on('ready', function () {
				logger.info('watcher', 'scan over')
			})
	},

	stop: function () {
		logger.info('watcher', 'stop')

		this._watcher.close()
		this._watcher.unwatch(this._root)
	},

	root: function () {
		return this._root
	},

	watcherConfig: function (value) {
		if (value === undefined) {
			return this._watcherConfig
		} else {
			this._watcherConfig = WatcherConfig.create(value)
		}
	}
}
