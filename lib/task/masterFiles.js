var u    = require('../model/utility'),
    _    = require('underscore'),
    path = require('path'),
    log  = require('../log').get()

// @日志, 使用js-schema只能检查数据类型有效性, 不能处理数据
// 修改js-schema使之能处理数据的难度太大, 因此只得放弃使用js-schema


var example = {
	match    : [
		[/abc/, 1],
		[/xxx/, 2]
	],
	onProcess: function (masterPath, info) {

	}
}

module.exports = {
	get: function (masterFiles) {
		var state
		var result = this._masterFiles(masterFiles, function (s, msg, d) {
			state = [s, msg]
			return d
		})

		if (JSON.stringify(state[0]).indexOf('warn') >= 0) {
			log.warn('masterFiles', 'warn param')
		}
		return result
	},


	// return: Undefined, Function, RegExp, Array, Object
	_masterFiles: function (masterFiles, setState) {
		setState('right')
		var VALUE = undefined
		var MSG = 'Undefined, Function, RegExp, Array, Object'
		if (_.isUndefined(masterFiles)) return masterFiles
		if (_.isFunction(masterFiles)) return masterFiles
		// todo, 这里将无法保证内部校验一定能通过, 因此若错误消息在底层报出将会对用户产生困扰
		if (_.isRegExp(masterFiles)) masterFiles = {match: masterFiles}
		if (_.isArray(masterFiles)) masterFiles = {match: masterFiles}
		if (_.isObject(masterFiles)) {
			var state = {}
			masterFiles.match = this._match(masterFiles.match, function (s, msg, d) {
				state.match = [s, msg]
				return d
			})
			masterFiles.onProcess = this._onProcess(masterFiles.onProcess, function (s, msg, d) {
				state.onProcess = [s, msg]
				return d
			})
			return setState(state, undefined, masterFiles)
		}

		return setState('warn', MSG, VALUE)
	},

	// return: Array<matchItem>(Can be empty)
	_match: function (match, setState) {
		setState('right')
		var VALUE = []
		var MSG = 'Array'
		if (_.isUndefined(match)) return []
		if (_.isRegExp(match)) match = [match]
		if (_.isArray(match)) {
			var state = []
			match = _.map(match, function (matchItem, index) {
				return this._matchItem(matchItem, function (result, msg, d) {
					state[index] = [result, msg]
					return d
				})
			}.bind(this))
			return match
		}

		return setState('warn', MSG, VALUE)
	},

	// return: Undefined, [RegExp, Number]
	_matchItem: function (matchItem, setState) {
		setState('right')
		var VALUE = undefined
		var MSG = 'Undefined, RegExp, Array'
		if (_.isUndefined(matchItem)) return matchItem
		if (_.isRegExp(matchItem)) return [matchItem, 1] // todo, 必须是//g模式, 必须有至少一个分组
		if (_.isArray(matchItem)) {
			if (matchItem.length == 0) return setState('warn', MSG, VALUE)
			if (matchItem.length == 1 && _.isRegExp(matchItem[0])) return [matchItem[0], 1]
			if (_.isRegExp(matchItem[0]) && _.isNumber(matchItem[1])) return [matchItem[0], matchItem[1]]
			// todo, 不管怎么样的参数最后去执行还是可能会出错, 所以要try-catch
		}

		return setState('warn', MSG, VALUE)
	},

	// return:  Function
	_onProcess: function (onProcess, setState) {
		setState('right')
		var VALUE = this._onProcessDefault
		var MSG = 'Function'
		if (_.isUndefined(onProcess)) return this._onProcessDefault
		if (_.isFunction(onProcess)) return onProcess

		return setState('warn', MSG, VALUE)
	},

	_onProcessDefault: function (masterPath, info) {
		return path.join(info.dirRelativePath, masterPath + info.fileAllExtensions)
	}
}