var _          = require('underscore'),
    u          = require('./utility'),
    logger     = require('../log').get(),
    velocityjs = require('velocityjs'),
    trim       = require('underscore.string/trim')


var trycatch = function (fn, defaultValue) { // todo, 重构移入utility
	try {
		return fn()
	} catch (e) {
		if (e instanceof  Error) {
			logger.error(e.stack)
		} else {
			logger.error(String(e))
		}
		return defaultValue()
	}
}

var WatcherTask = {
	create: function (config) {
		var obj = Object.create(this)
		obj._config = config || {}
		obj._buildConfig('isEnabled')
		obj._buildConfig('matchOnFileRelativePath')
		obj._buildConfig('program')
		obj._buildConfig('arguments')
		obj._buildConfig('createOutputFromStdout')
		obj._buildConfig('outputPath')
		obj._buildConfig('dependFiles')
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
		if (_.isFunction(matchOnFileRelativePath)) {
			return matchOnFileRelativePath
		}

		if (_.isUndefined(matchOnFileRelativePath)) {
			return []
		}

		if (_.isRegExp(matchOnFileRelativePath)) {
			return [matchOnFileRelativePath]
		}

		if (u.isArrayContains(matchOnFileRelativePath, _.isRegExp)) {
			return matchOnFileRelativePath
		}

		logger.warn('matchOnFileRelativePath must be Undefined, RegExp, Array<RegExp> or Function')
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
			for (var i = 0; i < match.length; i++) {
				if (match[i].test(fileRelativePath)) {
					return true
				}
			}
			return false
		}
	},

	// event: Add/Change/Update/Delete
	_eventHandle: function (handle, event) {
		if (_.isFunction(handle)) return handle
		if (_.isObject(handle)) {
			var program = this._program(handle.program)
			var arguments = this._arguments(handle.arguments)
			return {
				program  : program,
				arguments: arguments
			}
		}

		logger.error('on%s must be non-empty-String or Function', event)

		return undefined
	},

	_arguments: function (arguments) {
		if (_.isFunction(arguments)) {
			return arguments
		}

		if (_.isUndefined(arguments)) {
			return ''
		}

		if (_.isString(arguments)) {
			return arguments
		}

		if (u.isArrayContains(arguments, _.isString)) {
			return arguments.join(' ')
		}

		logger.warn('arguments must be Undefined, String, Array<String>, or Function')
		return ''
	},

	_program: function (program) {
		if (_.isFunction(program)) {
			return program
		}

		if (_.isString(program)) {
			return program
		}

		logger.error('program must be non-empty-String or Function')

		return undefined
	},

	program: function () {
		return this._config.program
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
		if (_.isUndefined(outputPath)) {
			return undefined
		}

		if (_.isString(outputPath)) {
			if (outputPath === '') {
				return undefined
			} else {
				return outputPath
			}
		}

		if (_.isFunction(outputPath)) {
			return outputPath
		}

		logger.warn('outputPath must be Undefined, String or Function')
		return undefined
	},

	outputPath: function (info) {
		var outputPath = this._config.outputPath
		if (outputPath === undefined) {
			return info.filePath + '.output' // todo 万一这个文件已存在怎么办
		} else if (_.isFunction(outputPath)) {
			return trycatch(
				function () {
					return String(outputPath(info))
				},
				function () {
					return info.filePath + '.output'
				})
		} else { // String
			return velocityjs.render(outputPath, info)
		}
	},

	_dependFiles: function (files) {
		if (_.isUndefined(files)) return []
		if (_.isString(files)) return [files]
		if (u.isArrayContains(files, _.isString)) return files
		if (_.isFunction(files)) return files

		logger.warn('dependFiles must be Undefined, String, Array<String> or Function')
		return []
	},

	dependFiles: function (info) {
		var dependFiles = this._config.dependFiles
		if (_.isFunction(dependFiles)) { // todo, 要对返回值做类型检查
			return trycatch(
				function () {
					return dependFiles(info)
				},
				function () {
					return []
				})
		} else { // Array
			return dependFiles
		}
	}
}

module.exports = WatcherTask
