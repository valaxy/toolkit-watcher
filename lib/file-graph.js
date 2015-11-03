var Graph = require('algorithm-data-structure/dest/graph/directed-linked-graph')
var dfs = require('algorithm-data-structure/dest/search/deep-first')


module.exports = {
	create: function () {
		var obj = Object.create(this)
		obj._g = new Graph
		return obj
	},

	getFilesUsed: function (fileRelative) {
		var result = []
		var mark = {}

		dfs({
			initial: fileRelative,
			next   : function (file, push) {
				this._g.eachEdge(function (nothing, to) {
					if (!mark[to]) {
						push(to)
					}
				}, file)
			}.bind(this),
			enter  : function (x) {
				mark[x] = true
				result.push(x)
			}
		})

		return result.slice(1) // remove initial one
	},

	onAddFile: function (fileRelativePath, depends) {
		this._g.addNode(fileRelativePath) // depends may empty
		depends.forEach(function (depend) {
			this._g.addEdge(depend, fileRelativePath)
		}.bind(this))
	},

	onChangeFile: function (fileRelativePath, depends) {
		if (this._g.hasNode(fileRelativePath)) {
			this.onDeleteFile(fileRelativePath)
		}
		this.onAddFile(fileRelativePath, depends)
	},

	onDeleteFile: function (fileRelativePath) {
		this._g.removeEdge(undefined, fileRelativePath)
		if (!this._g.hasEdge(fileRelativePath)) {
			this._g.removeNode(fileRelativePath)
		}
	}
}