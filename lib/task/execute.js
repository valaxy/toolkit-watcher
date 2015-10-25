var childProcess = require('child_process'),
    _            = require('underscore'),
    logger       = require('../log').get(),
    path         = require('path'),
    fs           = require('fs-extra')


// outputContent: the content to write
var outputFile = function (watcherTask, info, indent, outputContent) {
	var outputPath = watcherTask.outputPath(info) // todo, 可能不存在
	fs.outputFileSync(outputPath, outputContent)
	logger.info('output file to', indent + 1, outputPath)
}


var executeFunction = function (watcherTask, fn, info, indent) {
	logger.info('program function', indent, watcherTask.name().cyan, info.filePath)
	try {
		var result = fn(info)
		if (result !== undefined) {
			outputFile(watcherTask, info, indent, result)
		}
	} catch (e) {
		if (e instanceof Error) {
			logger.error('error', indent + 1)
			logger.error(null, e.stack.grey)
		} else {
			logger.error('error', indent + 1, String(e))
		}
	}
}


var executeCommand = function (watcherTask, program, info, indent) {
	var argString = watcherTask.arguments(info)
	var command = program + ' ' + argString
	logger.info('program cmd', indent, watcherTask.name().cyan, command)
	childProcess.exec(command, function (err, stdout, stderr) {
		if (err) {
			logger.error('error', indent + 1, err)
		} else if (stderr) {
			logger.error('error', indent + 1, stderr)
		} else if (watcherTask.createOutputFromStdout(info)) {
			outputFile(watcherTask, info, indent, stdout)
		}
	})
}


// watcherTask: the watcher task
// info: file info
// [indent]
var executeTask = function (watcherTask, info, indent) {
	indent = (indent === undefined ? 0 : indent)
	var program = watcherTask.program()
	if (_.isFunction(program)) { // Function program
		executeFunction(watcherTask, program, info, indent)
	} else {                    // String: cmd program
		executeCommand(watcherTask, program, info, indent);
	}
}


executeTask._executeFunction = executeFunction
executeTask._executeCommand = executeCommand

module.exports = executeTask