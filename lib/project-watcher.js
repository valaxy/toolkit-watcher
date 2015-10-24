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


// file can be absolute path or relative path of root
var executeTasks = function (filePath, stats, event) {
	var watcherTasks = this._watcherConfig.tasks()
	var info = marco(filePath, this.root())

	watcherTasks.forEach(function (watcherTask) {
		if (!watcherTask.isEnabled() || !watcherTask.isMatchOnFileRelativePath(info)) {
			return
		}

		// execute current file
		executeTask(watcherTask, info)

		var dependFiles = watcherTask.dependFiles(info)
		
		if (event == 'add') {
			this._fileGraph.onAddFile(info.fileRelativePath, dependFiles)
		} else { // change
			this._fileGraph.onChangeFile(info.fileRelativePath, dependFiles)
		}

		this._executeTaskOnMasterFiles(info.fileRelativePath, watcherTask)
	}.bind(this))
}


var onFileAdd = function (absolutePath, stats) {
	executeTasks.call(this, absolutePath, stats, 'add')
}


var onFileChange = function (absolutePath, stats) {
	executeTasks.call(this, absolutePath, stats, 'change')
}


module.exports = {
	_executeTaskOnMasterFiles: function (hostFileRelativePath, watcherTask) {
		this._fileGraph.getFilesUsed(hostFileRelativePath).forEach(function (masterFileRelativePath) {
			var masterFileAbsolutePath = path.join(this.root(), masterFileRelativePath)
			if (fs.existsSync(masterFileAbsolutePath)) {
				var masterFileInfo = marco(masterFileAbsolutePath, this.root()) // todo, 重构: 使用relativePath构造, 因为性能更好?
				//console.log(masterFileInfo)
				executeTask(watcherTask, masterFileInfo, 1)
			}
		}.bind(this))
	},

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
