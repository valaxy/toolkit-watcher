var assert = require('assert'),
    marco  = require('../lib/marco')


describe('Array', function () {
	it('no extension', function () {
		var dict = marco('/root/a', '/root')
		assert.equal('/root', dict.DirPath)
		assert.equal('root', dict.DirName)
		assert.equal('', dict.DirPathRelativeToProjectRoot)
		assert.equal('', dict.FileExtension)
		assert.equal('', dict.FileAllExtensions)
		assert.equal('a', dict.FileName)
		assert.equal('a', dict.FileNameWithoutExtension)
		assert.equal('a', dict.FileNameWithoutAllExtensions)
		assert.equal('/root/a', dict.FilePath)
		assert.equal('a', dict.FilePathRelativeToProjectRoot)
	})

	it('single extension', function () {
		var dict = marco('/root/project/a.md', '/root/')
		assert.equal('/root/project', dict.DirPath)
		assert.equal('project', dict.DirName)
		assert.equal('project', dict.DirPathRelativeToProjectRoot)
		assert.equal('.md', dict.FileExtension)
		assert.equal('.md', dict.FileAllExtensions)
		assert.equal('a.md', dict.FileName)
		assert.equal('a', dict.FileNameWithoutExtension)
		assert.equal('a', dict.FileNameWithoutAllExtensions)
		assert.equal('/root/project/a.md', dict.FilePath)
		assert.equal('project/a.md', dict.FilePathRelativeToProjectRoot)
	})

	it('multiply extensions', function () {
		var dict = marco('/root/project/a.md.html', '/root/')
		assert.equal('/root/project', dict.DirPath)
		assert.equal('project', dict.DirName)
		assert.equal('project', dict.DirPathRelativeToProjectRoot)
		assert.equal('.html', dict.FileExtension)
		assert.equal('.md.html', dict.FileAllExtensions)
		assert.equal('a.md.html', dict.FileName)
		assert.equal('a.md', dict.FileNameWithoutExtension)
		assert.equal('a', dict.FileNameWithoutAllExtensions)
		assert.equal('/root/project/a.md.html', dict.FilePath)
		assert.equal('project/a.md.html', dict.FilePathRelativeToProjectRoot)
	})
})