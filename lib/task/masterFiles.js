var u = require('../model/utility')
var _ = require('underscore')
var schema = require('js-schema')

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

var error = {
	match: ''
}

module.exports = {
	get: function (masterFiles, state) {

	},

	_masterFiles: function (masterFiles) {
		if (_.isUndefined(masterFiles)) return []
		if (_.isString(masterFiles)) return [masterFiles]
		if (_.isRegExp(masterFiles)) return [masterFiles]
		if (u.isArrayContains(masterFiles, u.isStringOrRegexp)) return masterFiles
		if (_.isFunction(masterFiles)) return masterFiles
		if (_.isObject(masterFiles)) {
			this._match(masterFiles.match)
			this._onProcess()
		}
	},

	_match: function (match, setState) {
		setState(RIGHT)
		if (_.isUndefined(match)) return []
		if (_.isString(match)) return [match]
		if (_.isRegExp(match)) return [match]
		if (_.isArray(match)) {
			var state = []
			match.forEach(function (matchItem, index) {
				this._matchItem(matchItem, function (result) {
					state[index] = result
					return undefined
				})
			}.bind(this))
		}
	},

	// return: Undefined, [RegExp, Number]
	_matchItem: function (matchItem, setState) {
		setState('right')
		if (_.isRegExp(matchItem)) return [matchItem, 1] // todo, 必须是//g模式, 必须有至少一个分组
		if (_.isArray(matchItem)) {
			if (matchItem.length == 0) return setState('warn')
			if (matchItem.length == 1 && _.isRegExp(matchItem[0])) return [matchItem[0], 1]
			if (_.isRegExp(matchItem[0]) && _.isNumber(matchItem[1])) return [matchItem[0], matchItem[1]]
			// todo, 不管怎么样的参数最后去执行还是可能会出错, 所以要try-catch
		}

		return setState('warn')
	},

	// return: Undefined, Function
	_onProcess: function (onProcess, setState) {
		setState('right')
		if (_.isUndefined(onProcess)) return onProcess
		if (_.isFunction(onProcess)) return onProcess

		return setState('warn')
	}
}
