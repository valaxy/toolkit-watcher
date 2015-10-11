var _ = require('underscore')

module.exports = {

	/** `ary` is Array and all elements match `isFunction` */
	isArrayContains: function (ary, isFunction) {
		if (!_.isArray(ary)) {
			return false
		}

		for (var i = 0; i < ary.length; i++) {
			if (!isFunction(ary[i])) {
				return false
			}
		}

		return true
	}
}