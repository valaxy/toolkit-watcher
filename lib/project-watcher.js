var chokidar      = require('chokidar'),
    path          = require('path'),
    _             = require('underscore'),
    fs            = require('fs-extra'),
    marco         = require('./marco'),
    WatcherConfig = require('./model/watcher-config'),
    logger        = require('./log').get(),
    FileGraph     = require('./file-graph'),
    u             = require('./model/utility'),
    executeTask   = require('./task/execute'),
    async         = require('async')

var id = 0
// file can be absolute path or relative path of root
var executeTasks = function (filePath, stats, event) {
	var watcherTasks = this._watcherConfig.tasks()
	var info = marco(filePath, this.root())
	watcherTasks.forEach(function (watcherTask) {
		if (!watcherTask.isEnabled() || !watcherTask.isMatchOnFileRelativePath(info)) {
			return
		}
		// execute current file
		if (this._buildAll || this._isReady) {
			this._queue.push({
				watcherTask: watcherTask,
				info       : info,
				indent     : 0
			})
		}

		var dependFiles = watcherTask.dependFiles(info)

		if (event == 'add') {
			this._fileGraph.onAddFile(info.fileRelativePath, dependFiles)
		} else { // change
			this._fileGraph.onChangeFile(info.fileRelativePath, dependFiles)
		}

		if (this._processMasterFile) {
			this._executeTaskOnMasterFiles(info.fileRelativePath, watcherTask)
		}
	}.bind(this))
}


module.exports = {
	init: function (root) {
		this._root = u.normalizePath(root)
		this._watcherConfig = WatcherConfig.createDefault()
		this._watcher = null
		this._fileGraph = FileGraph.create()
		this._processMasterFile = false
		this._isReady = false
		this._queue = async.queue(function (data, cb) {
			setTimeout(function () {
				executeTask(data.watcherTask, data.info, data.indent, cb)
			}, 0) // todo, 复制的太快会导致进程直接crash, 原因不明
		}, 1) // 10 tasks at most
	},

	_onFileAdd: function (absolutePath, stats) {
		executeTasks.call(this, absolutePath, stats, 'add')
	},

	_onFileChange: function (absolutePath) {
		executeTasks.call(this, absolutePath, {}, 'change')
	},

	_executeTaskOnMasterFiles: function (hostFileRelativePath, watcherTask) {
		this._fileGraph.getFilesUsed(hostFileRelativePath).forEach(function (masterFileRelativePath) {
			var masterFileAbsolutePath = path.join(this.root(), masterFileRelativePath)
			if (fs.existsSync(masterFileAbsolutePath)) {
				var masterFileInfo = marco(masterFileAbsolutePath, this.root()) // todo, 重构: 使用relativePath构造, 因为性能更好?
				this._queue.push({
					watcherTask: watcherTask,
					info       : masterFileInfo,
					indent     : 1
				})
			} else {
				logger.warn('not exist', 1, masterFileAbsolutePath)
			}
		}.bind(this))
	},

	start: function (buildAll) {
		logger.info('watcher', 'buildAll: ' + buildAll + ' start at', this.root())

		this._buildAll = buildAll
		this._watcher = chokidar.watch(this._root, {
				usePolling: true,
				persistent: !buildAll,
				ignored   : function (fileAbsoultePath) {
					var fileRelativePath = path.relative(this._root, fileAbsoultePath)
					if (fileRelativePath == '') { // root of project
						return false
					}
					if (/^\.toolkit/.test(fileRelativePath)) { // root of toolkit
						return true
					}
					var result = !this._watcherConfig.isMatchFile({
						fileRelativePath: fileRelativePath
					})
					return result
				}.bind(this)
			})
			.on('add', this._onFileAdd.bind(this))
			.on('change', this._onFileChange.bind(this))
			.on('ready', function () {
				this._isReady = true
				this._processMasterFile = true // before ready, no need to compile on master file
				logger.info('watcher', 'scan over')
				//if (buildAll) {this.stop()} todo 没卵用
			}.bind(this))
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
