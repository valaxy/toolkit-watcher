var u = require('../model/utility')
var _ = require('underscore')
var schema = require('js-schema')

// @日志, 使用js-schema只能检查数据类型有效性, 不能处理数据
// 修改js-schema使之能处理数据的难度太大, 因此只得放弃使用js-schema

module.exports = function (require) {


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

	var isMatchItem = function (matchItem) {

	}

	var wrap = function () {
	}

	var returnThis = function () {
	}

	var schema = {
		match: wrap([
			undefined,
			String,
			RegExp,
			Array.of([
				String,
				RegExp,
				Array.like([RegExp, Number])
			])
		], [
			returnThis,
			returnThis,
			returnThis,
			returnThis
		])
	}

	var RIGHT = 0
	var WARN = 1
	var WRONG = 2


	return {
		get: function (masterFiles, state) {

		},

		_masterFiles: function (masterFiles) {
			if (_.isUndefined(masterFiles)) return []
			if (_.isString(masterFiles)) return [masterFiles]
			if (_.isRegExp(masterFiles)) return [masterFiles]
			if (u.isArrayContains(masterFiles, u.isStringOrRegexp)) return masterFiles
			if (_.isFunction(masterFiles)) return masterFiles
		},

		_match: function (match, state, property) {
			if (_.isUndefined(match)) return []
			if (_.isString(match)) return [match]
			if (_.isRegExp(match)) return [match]
			if (u.isArrayContains(match, u.isStringOrRegexp)) return match
		},
		
		_matchItem: function (matchItem, setState) {
			setState(RIGHT)
			if (_.isRegExp(matchItem)) return matchItem
			if (_.isArray(matchItem)) {
				if (matchItem.length == 0) return setState(WARN)
				if (matchItem.length == 1 && _.isRegExp(matchItem[0])) return matchItem
				if (_.isRegExp(matchItem[0]) && _.isInteger(matchItem[1])) return matchItem
			}

			return setState(WARN)
		}
	}
}