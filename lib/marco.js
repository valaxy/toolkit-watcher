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
	marco.DirPath = normalize(path.dirname(fileAbsolutePath))
	marco.DirName = path.basename(marco.DirPath)
	marco.DirPathRelativeToProjectRoot = normalize(path.relative(projectRoot, marco.DirPath))

	marco.FileExtension = path.extname(fileAbsolutePath)
	marco.FileAllExtensions = getAllExtensions(fileAbsolutePath)
	marco.FileName = path.basename(fileAbsolutePath)
	marco.FileNameWithoutExtension = path.basename(marco.FileName, marco.FileExtension)
	marco.FileNameWithoutAllExtensions = path.basename(marco.FileName, marco.FileAllExtensions)
	marco.FilePath = normalize(fileAbsolutePath)
	marco.FilePathRelativeToProjectRoot = normalize(path.relative(projectRoot, marco.FilePath))

	return marco
}

// marco.FileEncoding = ''
// marco.ClipboardContent = ''
// marco.ColumnNumber = ''
// marco.FileDirPathFromParent = '' // ?
// marco.FileDirRelativeToSourcepath = '' // ?
// marco.FilePathRelativeToSroucepath = '' // ?
