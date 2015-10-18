var assert = require('assert'),
    marco  = require('../lib/marco')


describe('marco', function () {
	it('file with no extension', function () {
		var dict = marco('/root/a', '/root')
		assert.equal('/root', dict.dirPath)
		assert.equal('root', dict.dirName)
		assert.equal('', dict.dirRelativePath)
		assert.equal('', dict.fileExtension)
		assert.equal('', dict.fileAllExtensions)
		assert.equal('a', dict.fileName)
		assert.equal('a', dict.fileNameWithoutExtension)
		assert.equal('a', dict.fileNameWithoutAllExtensions)
		assert.equal('/root/a', dict.filePath)
		assert.equal('a', dict.fileRelativePath)
	})

	it('file with single extension', function () {
		var dict = marco('/root/project/a.md', '/root/')
		assert.equal('/root/project', dict.dirPath)
		assert.equal('project', dict.dirName)
		assert.equal('project', dict.dirRelativePath)
		assert.equal('.md', dict.fileExtension)
		assert.equal('.md', dict.fileAllExtensions)
		assert.equal('a.md', dict.fileName)
		assert.equal('a', dict.fileNameWithoutExtension)
		assert.equal('a', dict.fileNameWithoutAllExtensions)
		assert.equal('/root/project/a.md', dict.filePath)
		assert.equal('project/a.md', dict.fileRelativePath)
	})

	it('file with multiply extensions', function () {
		var dict = marco('/root/project/a.md.html', '/root/')
		assert.equal('/root/project', dict.dirPath)
		assert.equal('project', dict.dirName)
		assert.equal('project', dict.dirRelativePath)
		assert.equal('.html', dict.fileExtension)
		assert.equal('.md.html', dict.fileAllExtensions)
		assert.equal('a.md.html', dict.fileName)
		assert.equal('a.md', dict.fileNameWithoutExtension)
		assert.equal('a', dict.fileNameWithoutAllExtensions)
		assert.equal('/root/project/a.md.html', dict.filePath)
		assert.equal('project/a.md.html', dict.fileRelativePath)
	})

	it('project', function () {
		var dict = marco('xyz', 'c:/project')
		assert.equal('project', dict.projectName)
		assert.equal('c:/project', dict.projectPath)
	})
})