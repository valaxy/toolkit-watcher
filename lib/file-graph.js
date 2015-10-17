var Graph = require('algorithm-data-structure/src/graph/directed-linked-graph')


module.exports = {
	create: function () {
		var obj = Object.create(this)
		obj._g = new Graph
		return obj
	},

	getFilesUsed: function (fileRelative) {
		var ary = []
		this._g.eachEdge(function (fileRelative, to) {
			ary.push(to)
		}, fileRelative)
		return ary
	},

	onAddFile: function (fileRelativePath, depends) {
		depends.forEach(function (depend) {
			this._g.addEdge(depend, fileRelativePath)
		}.bind(this))
	},

	onChangeFile: function (fileRelativePath, depends) {
		this.onDeleteFile(fileRelativePath)
		this.onAddFile(fileRelativePath, depends)
	},

	onDeleteFile: function (fileRelativePath) {
		this._g.removeEdge(undefined, fileRelativePath)
	}
}