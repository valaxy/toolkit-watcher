var assert                  = require('assert'),
    WatcherConfigCollection = require('../../lib/model/watcher-config-collection'),
    _                       = require('underscore')


describe('WatcherConfigCollection', function () {
	it('toJSON()/add()/remove()/count()', function () {
		// single add
		var wcc = WatcherConfigCollection.create()
		assert.deepEqual({
			ignoreOnFileRelativePath: [],
			tasks                   : []
		}, wcc.toJSON())
		assert.equal(wcc.count(), 0)


		// add one
		wcc.add('/a', {
			tasks                   : [{}], // todo, ����û����������
			ignoreOnFileRelativePath: ['1']
		})
		assert.deepEqual({
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
			ignoreOnFileRelativePath: ['1', '2'],
			tasks                   : [{}, {}]
		}, wcc.toJSON())
		assert.equal(wcc.count(), 2)


		// add same
		wcc.add('/a', {
			tasks                   : [{}],
			ignoreOnFileRelativePath: ['3']
		})
		assert.deepEqual({
			ignoreOnFileRelativePath: ['3', '2'],
			tasks                   : [{}, {}]
		}, wcc.toJSON())
		assert.equal(wcc.count(), 2)


		// remove
		wcc.remove('/b')
		assert.equal(wcc.count(), 1)
		assert.deepEqual({
			ignoreOnFileRelativePath: ['3'],
			tasks                   : [{}]
		}, wcc.toJSON())
	})
})