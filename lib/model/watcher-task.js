var _          = require('underscore'),
    u          = require('./utility'),
    logger     = require('../log').get(),
    velocityjs = require('velocityjs'),
    path       = require('path'),
    trim       = require('underscore.string/trim')

var trycatch = function (fn, defaultValue) { // todo, 重构移入utility
	try {
		return fn()
	} catch (e) {
		if (e instanceof Error) {
			logger.error(e.stack)
		} else {
			logger.error(String(e))
		}
		return defaultValue()
	}
}

// todo 考虑使用type-check组件重构
// todo 考虑参数关联性

var WatcherTask = {
	create: function (config) {
		var obj = Object.create(this)
		obj._config = config || {}
		obj._buildConfig('name')
		obj._buildConfig('isEnabled')
		obj._buildConfig('matchOnFileRelativePath')
		obj._buildConfig('program', 'eventHandleProgram')
		obj._buildConfig('arguments', 'eventHandleArguments')
		obj._buildConfig('createOutputFromStdout')
		obj._buildConfig('outputPath')
		obj._config.dependFiles = require('../task/masterFiles').get(obj._config.dependFiles)
		obj._config.onProcess = config.onProcess
		//obj._buildConfig('dependFiles')
		obj._buildConfig('onAdd', 'eventHandle', 'Add')
		obj._buildConfig('onChange', 'eventHandle', 'Change')
		obj._buildConfig('onUpdate', 'eventHandle', 'Update')
		obj._buildConfig('onDelete', 'eventHandle', 'Delete')
		return obj
	},

	_buildConfig: function (keyInConfig, fnKey) {
		var valueOfConfig = this._config[keyInConfig]
		if (fnKey === undefined) {
			var buildArgs = Array.prototype.splice.call(arguments, 1)
			fnKey = keyInConfig
		} else {
			var buildArgs = Array.prototype.splice.call(arguments, 2)
		}

		buildArgs.splice(0, 0, valueOfConfig)
		this._config[keyInConfig] = this['_' + fnKey].apply(this, buildArgs)
	},

	_name: function (name) {
		if (u.isNonEmptyString(name)) return name
		return 'task'
	},

	name: function () {
		return this._config.name
	},

	/** default is false */
	_isEnabled: function (isEnabled) {
		if (_.isFunction(isEnabled)) {
			return isEnabled
		}

		if (_.isUndefined(isEnabled)) {
			return false
		}

		if (_.isBoolean(isEnabled)) {
			return isEnabled
		}

		logger.warn('isEnabled must be Undefined, Boolean, or Function')
		return false
	},

	isEnabled: function () {
		var isEnabled = this._config.isEnabled

		if (_.isFunction(isEnabled)) {
			return trycatch(function () {
				return !!isEnabled()
			}, function () {
				return false
			})
		} else {
			return isEnabled
		}
	},

	/** at least match one */
	_matchOnFileRelativePath: function (matchOnFileRelativePath) {
		if (_.isFunction(matchOnFileRelativePath)) return matchOnFileRelativePath
		if (_.isUndefined(matchOnFileRelativePath)) return []
		if (_.isRegExp(matchOnFileRelativePath)) return [matchOnFileRelativePath]
		if (_.isString(matchOnFileRelativePath)) return [matchOnFileRelativePath]
		if (u.isArrayContains(matchOnFileRelativePath, u.isStringOrRegexp)) return matchOnFileRelativePath

		logger.warn('matchOnFileRelativePath must be Undefined, String, RegExp, Array<RegExp, String> or Function')
		return []
	},

	isMatchOnFileRelativePath: function (info) { // todo, 感觉MatchOnFileRelativePath命名不太科学, 当是自定义Function的时候
		var match = this._config.matchOnFileRelativePath

		if (_.isFunction(match)) {
			return trycatch(
				function () {
					return match(info)
				},
				function () {
					return false
				}
			)
		} else {
			var fileRelativePath = info.fileRelativePath
			return u.testOnceAtLeast(fileRelativePath, match)
		}
	},

	// event: Add/Change/Update/Delete
	_eventHandle: function (handle, event) {
		if (_.isUndefined(handle)) return handle
		if (_.isFunction(handle)) return handle
		if (_.isObject(handle)) {
			var program = this._eventHandleProgram(handle.program)
			var arguments = this._eventHandleArguments(handle.arguments)
			return {
				program  : program,
				arguments: arguments
			}
		}

		logger.error('on%s must be Undefined, Object or Function', event)
		return undefined
	},

	_eventHandleArguments: function (arguments) {
		if (_.isFunction(arguments)) return arguments
		if (_.isUndefined(arguments)) return ''
		if (_.isString(arguments))    return arguments
		if (u.isArrayContains(arguments, _.isString)) return arguments.join(' ')

		logger.warn('arguments must be Undefined, String, Array<String>, or Function')
		return ''
	},

	_eventHandleProgram: function (program) {
		if (_.isFunction(program)) return program
		if (_.isString(program)) return program

		logger.error('program must be non-empty-String or Function')

		return undefined
	},


	program: function () {
		return this._config.program
	},

	onProcess: function () {
		return this._config.onProcess
	},

	arguments: function (info) {
		var _arguments = this._config.arguments
		if (_.isFunction(_arguments)) {
			return trycatch(
				function () {
					return String(_arguments(info)) // arguments var conflict
				},
				function () {
					return ''
				}
			)
		} else {
			return velocityjs.render(_arguments, info)
		}
	},

	_createOutputFromStdout: function (option) {
		if (_.isUndefined(option)) {
			return false
		}

		if (_.isBoolean(option)) {
			return option
		}

		logger.warn('createOutputFromStdout must be Undefined or Boolean')
		return false
	},

	createOutputFromStdout: function () {
		return this._config.createOutputFromStdout
	},


	_outputPath: function (outputPath) {
		if (_.isUndefined(outputPath)) return outputPath
		if (u.isNonEmptyString(outputPath)) return outputPath
		if (_.isFunction(outputPath)) return outputPath

		logger.warn('outputPath must be Undefined, non-empty-String or Function')
		return undefined
	},

	/** always return absolute output path */
	outputPath: function (info) {
		var outputPath = this._config.outputPath
		if (_.isUndefined(outputPath)) {
			return info.filePath + '.output' // todo 万一这个文件已存在怎么办
		}

		if (_.isFunction(outputPath)) {
			outputPath = trycatch(
				function () {
					return String(outputPath(info))
				},
				function () {
					return info.filePath + '.output'
				})
		} else { // String
			outputPath = velocityjs.render(outputPath, info)
		}

		// convert to absolute path
		if (!path.isAbsolute(outputPath)) {
			return u.normalizePath(path.join(info.projectPath, outputPath))
		} else {
			return u.normalizePath(outputPath)
		}
	},

	/** Array<String> */
	dependFiles: function (info) {
		var dependFiles = this._config.dependFiles
		if (_.isFunction(dependFiles)) { // todo, 要对返回值做类型检查
			var result = trycatch(
				function () {
					return dependFiles(info)
				},
				function () {
					return []
				})
		} else if (_.isUndefined(dependFiles)) { // todo, 检查是否有undefined
			return []
		} else { // Array
			var result = []
			var match = dependFiles.match
			var onProcess = dependFiles.onProcess
			match.forEach(function (matchItem) {
				if (_.isString(matchItem)) { // todo, 这里可以去掉了
					result.push(matchItem)
					return
				}

				// RegExp
				var code = info.fileContent
				var reg = matchItem[0]
				var index = matchItem[1]
				while (true) {
					var match = reg.exec(code) // todo, 正则表达式必须是贪婪模式
					if (!match) break
					result.push(onProcess(match[index], info))
				}
			})
		}

		// convert to relative path & normalize
		return _.map(result, function (masterPath) { // todo, 进一步校验, 必须属于该工程的文件
			if (path.isAbsolute(masterPath)) {
				masterPath = path.relative(info.dirPath, masterPath)
			}
			return u.normalizePath(masterPath)
		})
	}
}

module.exports = WatcherTask

//// return Array<String,RegExp> | Function
//_dependFiles: function (files) {
//	if (_.isUndefined(files)) return []
//	if (_.isString(files)) return [files]
//	if (_.isRegExp(files)) return [files]
//	if (u.isArrayContains(files, u.isStringOrRegexp)) return files
//	if (_.isFunction(files)) return files
//
//
//	logger.warn('dependFiles must be Undefined, String, Array<RegExp,String> or Function')
//	return []
//},
