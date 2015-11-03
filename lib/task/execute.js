var childProcess = require('child_process'),
    _            = require('underscore'),
    logger       = require('../log').get(),
    path         = require('path'),
    fs           = require('fs-extra')


var executeFunction = function (watcherTask, fn, info, indent, callback) {
	logger.info('program function', indent, watcherTask.name().cyan, info.filePath)
	try {
		var result = fn(info)
		if (result !== undefined) {
			outputFile(watcherTask, info, indent, result, callback)
		} else {
			callback()
		}
	} catch (err) {
		callback(err)
	}
}

var executeCommand = function (watcherTask, program, info, indent, callback) {
	var argString = watcherTask.arguments(info)
	var command = program + ' ' + argString
	logger.info('program cmd', indent, watcherTask.name().cyan, command)
	childProcess.exec(command, function (err, stdout, stderr) {
		if (err || stderr) {
			return callback(err || stderr)
		}

		if (watcherTask.createOutputFromStdout(info)) {
			outputFile(watcherTask, info, indent, stdout, callback)
		} else {
			callback()
		}
	})
}


// outputContent: the content to write
var outputFile = function (watcherTask, info, indent, outputContent, callback) {
	var outputPath = watcherTask.outputPath(info) // todo, 可能不存在
	//if (watcherTask.onProcess) {
	//	outputContent = watcherTask.onProcess(outputContent)
	//}
	fs.outputFile(outputPath, outputContent, function (err) {
		logger.info('output file to', indent + 1, outputPath)
		callback(err)
	})
}


// watcherTask: the watcher task
// info: file info
// [indent]
// cb
var executeTask = function (watcherTask, info, indent, cb) {
	indent = (indent === undefined ? 0 : indent)

	var callback = function (err) {
		if (err) {
			if (err instanceof Error) {
				logger.error('error', indent + 1)
				logger.error(null, indent + 1, err.stack.grey)
			} else {
				logger.error('error', indent + 1, String(err))
			}
		}
		cb()
	}

	var program = watcherTask.program()
	if (_.isFunction(program)) { // Function program
		executeFunction(watcherTask, program, info, indent, callback)
	} else {                    // String: cmd program
		executeCommand(watcherTask, program, info, indent, callback)
	}
}


executeTask._executeFunction = executeFunction
executeTask._executeCommand = executeCommand
executeTask._outputFile = outputFile

module.exports = executeTask