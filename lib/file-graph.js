module.exports = {
	create: function () {
		var obj = Object.create(this)
		obj._map = {}
		return obj
	},

	addDepends: function (fileRelativePath, depends) {
		depends.forEach(function (depend) {
			if (!(depend in this._map)) {
				this._map[depend] = new Set([fileRelativePath])
			} else {
				this._map[depend].add(fileRelativePath)
			}
		}.bind(this))
	},


	onChangeFile: function (fileRelativePath, depends) {
		depends.forEach(function (depend) {

		})
	},

	onDeleteFile: function (fileRelativePath) {
		delete this._map[fileRelativePath]
	}
}