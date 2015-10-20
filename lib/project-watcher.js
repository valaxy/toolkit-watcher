var chokidar      = require('chokidar'),
    path          = require('path'),
    _             = require('underscore'),
    childProcess  = require('child_process'),
    fs            = require('fs-extra'),
    marco         = require('./marco'),
    WatcherConfig = require('./model/watcher-config'),
    logger        = require('./log').get()


var executeProgram = function (fileAbsolutePath, event) { // todo, p不是绝对路径
	var watcherTasks = this._watcherConfig.tasks()
	var info = marco(fileAbsolutePath, this.root())

	watcherTasks.forEach(function (watcherTask) {
		var program = watcherTask.program()

		if (_.isFunction(program)) { // function program, todo program里面没有判断文件匹配!!!!
			if (watcherTask.isEnabled() && watcherTask.isMatchOnFileRelativePath(info)) {
				try {
					program(info)
					logger.info('program function'.cyan, info.filePath)
				} catch (e) {
					if (e instanceof Error) {
						logger.error('program function error'.red, e.stack)
					} else {
						logger.error('program function error'.red, String(e))
					}
				}
			}
		} else if (_.isString(program)) { // cmd program
			var argString = watcherTask.arguments(info)
			var cmd = program + ' ' + argString
			if (watcherTask.isEnabled() && watcherTask.isMatchOnFileRelativePath(info)) {
				childProcess.exec(cmd, function (err, stdout, stderr) {
					logger.info('program cmd'.cyan, cmd)
					if (err) {
						logger.error('program cmd error'.red, err)
					} else if (stderr) {
						logger.error('program cmd error'.red, stderr)
					}

					if (watcherTask.createOutputFromStdout(info)) {
						var outputPath = watcherTask.outputPath(info)
						if (!path.isAbsolute(outputPath)) {
							outputPath = path.join(info.projectPath, outputPath)
						}
						fs.outputFile(outputPath, stdout)
						logger.info('output file to'.cyan, outputPath)
					}
				})
			}
		} else {
			// do nothing
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
		logger.info('watcher'.cyan, 'start')

		this._watcher = chokidar.watch(this._root, {
			ignored: function (fileAbsoultePath) {
				var fileRelativePath = path.relative(this._root, fileAbsoultePath)
				if (/^\.toolkit/.test(fileRelativePath)) { // todo, 这里需要重构
					return true
				}
				if (fileRelativePath == '') {
					return false
				}
				return !this._watcherConfig.isMatchFile({
					fileRelativePath: fileRelativePath
				})
			}.bind(this)
		})
			.on('add', function (path, event) {
				executeProgram.call(this, path, event)
			}.bind(this))
			.on('change', function (path, event) {
				executeProgram.call(this, path, event)
			}.bind(this))
			.on('ready', function () {
				logger.info('watcher'.cyan, 'scan over')
			})
	},

	stop: function () {
		logger.info('watcher'.cyan, 'stop')

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
			logger.info('watcher config'.cyan, 'load')
			this._watcherConfig = WatcherConfig.create(value)
		}
	}
}
