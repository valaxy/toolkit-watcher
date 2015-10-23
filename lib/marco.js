var path = require('path'),
    fs   = require('fs-extra'),
    u    = require('./model/utility')

var getAllExtensions = function (filePath) {
	var s = ''
	while (true) {
		var ext = path.extname(filePath)
		if (ext == '') {
			break
		}
		s = ext + s
		filePath = path.basename(filePath, ext)
	}
	return s
}

module.exports = function (fileAbsolutePath, projectRoot) {
	var marco = {}
	marco.dirPath = u.normalizePath(path.dirname(fileAbsolutePath))
	marco.dirRelativePath = u.normalizePath(path.relative(projectRoot, marco.dirPath))
	marco.dirName = path.basename(marco.dirPath)

	marco.fileExtension = path.extname(fileAbsolutePath)
	marco.fileAllExtensions = getAllExtensions(fileAbsolutePath)
	marco.fileName = path.basename(fileAbsolutePath)
	marco.fileNameWithoutExtension = path.basename(marco.fileName, marco.fileExtension)
	marco.fileNameWithoutAllExtensions = path.basename(marco.fileName, marco.fileAllExtensions)
	marco.filePath = u.normalizePath(fileAbsolutePath)
	marco.fileRelativePath = u.normalizePath(path.relative(projectRoot, marco.filePath))

	if (fs.existsSync(fileAbsolutePath)) {
		marco.fileContent = fs.readFileSync(fileAbsolutePath, {encoding: 'utf-8'})
	} else {
		marco.fileContent = ''
	}

	marco.projectPath = projectRoot
	marco.projectName = path.basename(projectRoot)

	return marco
}

// marco.FileEncoding = ''
// marco.ClipboardContent = ''
// marco.ColumnNumber = ''
// marco.FileDirPathFromParent = '' // ?
// marco.FileDirRelativeToSourcepath = '' // ?
// marco.FilePathRelativeToSroucepath = '' // ?
