var path = require('path')

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

var normalize = function (p) {
	return p.replace(/\\/g, '/')
}

module.exports = function (fileAbsolutePath, projectRoot) {
	var marco = {}
	marco.dirPath = normalize(path.dirname(fileAbsolutePath))
	marco.dirRelativePath = normalize(path.relative(projectRoot, marco.dirPath))
	marco.dirName = path.basename(marco.dirPath)

	marco.fileExtension = path.extname(fileAbsolutePath)
	marco.fileAllExtensions = getAllExtensions(fileAbsolutePath)
	marco.fileName = path.basename(fileAbsolutePath)
	marco.fileNameWithoutExtension = path.basename(marco.fileName, marco.fileExtension)
	marco.fileNameWithoutAllExtensions = path.basename(marco.fileName, marco.fileAllExtensions)
	marco.filePath = normalize(fileAbsolutePath)
	marco.fileRelativePath = normalize(path.relative(projectRoot, marco.filePath))

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
