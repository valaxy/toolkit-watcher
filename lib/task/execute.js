var childProcess = require('child_process'),
    _            = require('underscore'),
    logger       = require('../log').get(),
    path         = require('path'),
    fs           = require('fs-extra')


var executeFunction = function (fn, info, indent) {
	try {
		fn(info)
		logger.info('program function', indent, info.filePath)
	} catch (e) {
		if (e instanceof Error) {
			logger.error('error:', indent + 1)
			logger.error(null, e.stack.grey)
		} else {
			logger.error('error', indent + 1, String(e))
		}
	}
}


var executeCommand = function (watcherTask, program, info, indent) {
	var argString = watcherTask.arguments(info)
	var command = program + ' ' + argString
	childProcess.exec(command, function (err, stdout, stderr) {
		logger.info('program cmd', indent, command)
		if (err) {
			logger.error('error', indent + 1, err)
		} else if (stderr) {
			logger.error('error', indent + 1, stderr)
		}

		if (watcherTask.createOutputFromStdout(info)) {
			var outputPath = watcherTask.outputPath(info)
			fs.outputFile(outputPath, stdout)
			logger.info('output file to', indent + 1, outputPath)
		}
	})
}


// watcherTask: the watcher task
// info: file info
// indent
module.exports = function (watcherTask, info, indent) {
	indent = (indent === undefined ? 0 : indent)
	var program = watcherTask.program()
	if (watcherTask.isMatchOnFileRelativePath(info)) {
		if (_.isFunction(program)) { // Function program
			executeFunction(program, info, indent)
		} else {                    // String: cmd program
			executeCommand(watcherTask, program, info, indent);
		}
	}
}