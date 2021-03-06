var assert    = require('assert'),
    FileGraph = require('../lib/file-graph')


describe('FileGraph', function () {
	it('getFilesUsed()', function () {
		var fg = FileGraph.create()
		fg.onAddFile('a', [])
		assert.deepEqual([], fg.getFilesUsed('a'))

		fg.onAddFile('b', ['a'])
		assert.deepEqual(['b'], fg.getFilesUsed('a'))

		fg.onChangeFile('b', ['a', 'c'])
		assert.deepEqual(['b'], fg.getFilesUsed('a'))

		fg.onAddFile('a', ['d'])
		assert.deepEqual(['a', 'b'], fg.getFilesUsed('d'))

		fg.onDeleteFile('b')
		assert.deepEqual([], fg.getFilesUsed('c'))
		assert.deepEqual(['a'], fg.getFilesUsed('d'))
	})

	it('onAddFile()', function () {
		var fg = FileGraph.create()
		fg.onAddFile('a', ['a/1', 'a/2'])
		assert.deepEqual(['a'], fg.getFilesUsed('a/1'))
		fg.onAddFile('b', ['a/2'])
		assert.deepEqual(['b', 'a'], fg.getFilesUsed('a/2'))
	})

	it('onDeleteFile()', function () {
		var fg = FileGraph.create()
		fg.onAddFile('a', ['1', '2'])
		fg.onAddFile('b', ['1', '3'])
		fg.onAddFile('c', ['1', '4'])
		fg.onDeleteFile('a')
		assert.deepEqual(['c', 'b'], fg.getFilesUsed('1'))
	})

	it('onChangeFile()', function () {
		var fg = FileGraph.create()
		fg.onChangeFile('a', ['1', '2'])
		fg.onChangeFile('a', ['3', '4'])
		assert.deepEqual([], fg.getFilesUsed('1'))
		assert.deepEqual(['a'], fg.getFilesUsed('3'))
	})
})