var chokidar      = require('chokidar'),
    path          = require('path'),
    _             = require('underscore'),
    childProcess  = require('child_process'),
    fs            = require('fs-extra'),
    marco         = require('./marco'),
    WatcherConfig = require('./model/watcher-config'),
    logger        = require('./log').get(),
    FileGraph     = require('./file-graph'),
    u             = require('./model/utility')


var executeTask = function (watcherTask, info) {
	var program = watcherTask.program()

	if (_.isFunction(program)) { // function program
		if (watcherTask.isMatchOnFileRelativePath(info)) {
			try {
				program(info)
				logger.info('program function', 1, info.filePath)
			} catch (e) {
				if (e instanceof Error) {
					logger.error('program function', 1, e.stack)
				} else {
					logger.error('program function', 1, String(e))
				}
			}
		}
	} else { // String: cmd program
		var argString = watcherTask.arguments(info)
		var cmd = program + ' ' + argString
		if (watcherTask.isMatchOnFileRelativePath(info)) {
			childProcess.exec(cmd, function (err, stdout, stderr) {
				logger.info('program cmd', cmd)
				if (err) {
					logger.error('program cmd', 1, err)
				} else if (stderr) {
					logger.error('program cmd', 1, stderr)
				}

				if (watcherTask.createOutputFromStdout(info)) {
					var outputPath = watcherTask.outputPath(info)
					if (!path.isAbsolute(outputPath)) {
						outputPath = path.join(info.projectPath, outputPath)
					}
					fs.outputFile(outputPath, stdout)
					logger.info('output file to', 1, outputPath)
				}
			})
		}
	}
}

var executeProgram = function (fileAbsolutePath, stats, event) { // todo, fileAbsolutePath有时不是绝对路径
	var watcherTasks = this._watcherConfig.tasks()
	var info = marco(fileAbsolutePath, this.root())

	watcherTasks.forEach(function (watcherTask) {
		if (!watcherTask.isEnabled()) {
			return
		}

		// execute current file
		executeTask.call(this, watcherTask, info)

		var dependFiles = watcherTask.dependFiles(info)

		if (event == 'add') {
			this._fileGraph.onAddFile(info.fileRelativePath, dependFiles)
		} else { // change
			this._fileGraph.onChangeFile(info.fileRelativePath, dependFiles)
		}

		// execute depended files
		this._fileGraph.getFilesUsed(info.fileRelativePath).forEach(function (usedFile) {
			var absolutePath2 = path.join(this.root(), usedFile)
			if (fs.existsSync(absolutePath2)) {
				var info2 = marco(absolutePath2, this.root()) // todo, 重构: 使用relativePath构造
				executeTask.call(this, watcherTask, info2)
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
