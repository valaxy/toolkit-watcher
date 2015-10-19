var assert                  = require('assert'),
    WatcherConfigCollection = require('../../lib/model/watcher-config-collection'),
    _                       = require('underscore')


describe('WatcherConfigCollection', function () {
	it('toJSON()/add()/remove()/count()', function () {
		// single add
		var wcc = WatcherConfigCollection.create()
		assert.deepEqual({
			matchOnFileRelativePath : [],
			ignoreOnFileRelativePath: [],
			tasks                   : []
		}, wcc.toJSON())
		assert.equal(wcc.count(), 0)


		// add one
		wcc.add('/a', {
			tasks                   : [{}], // todo, 考虑没有数组的情况
			ignoreOnFileRelativePath: ['1']
		})
		assert.deepEqual({
			matchOnFileRelativePath : [],
			ignoreOnFileRelativePath: ['1'],
			tasks                   : [{}]
		}, wcc.toJSON())
		assert.equal(wcc.count(), 1)


		// add two
		wcc.add('/b', {
			tasks                   : [{}],
			ignoreOnFileRelativePath: ['2']
		})
		assert.deepEqual({
			matchOnFileRelativePath : [],
			ignoreOnFileRelativePath: ['1', '2'],
			tasks                   : [{}, {}]
		}, wcc.toJSON())
		assert.equal(wcc.count(), 2)


		// add same
		wcc.add('/a', {
			tasks                   : [{}],
			ignoreOnFileRelativePath: ['3'],
		})
		assert.deepEqual({
			matchOnFileRelativePath : [],
			ignoreOnFileRelativePath: ['3', '2'],
			tasks                   : [{}, {}]
		}, wcc.toJSON())
		assert.equal(wcc.count(), 2)


		// remove
		wcc.remove('/b')
		assert.equal(wcc.count(), 1)
		assert.deepEqual({
			matchOnFileRelativePath : [],
			ignoreOnFileRelativePath: ['3'],
			tasks                   : [{}]
		}, wcc.toJSON())
	})
})