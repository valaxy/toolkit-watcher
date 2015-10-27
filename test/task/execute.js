var assert          = require('assert'),
    WatcherTask     = require('../../lib/model/watcher-task'),
    temp            = require('temp').track(),
    fs              = require('fs-extra'),
    executeFunction = require('../../lib/task/execute')._executeFunction,
    executeCommand  = require('../../lib/task/execute')._executeCommand,
    outputFile      = require('../../lib/task/execute')._outputFile


describe('executeTask', function () {
	it('_executeFunction: return nothing', function (done) {
		var task = WatcherTask.create({
			program: function () {
				// nothing
			}
		})
		executeFunction(task, task.program(), {filePath: 'xx'}, 0, function () {
			assert.ok(true)
			done()
		})
	})


	it('_executeFunction: return content', function (done) {
		var filePath = temp.openSync().path
		var task = WatcherTask.create({
			outputPath: filePath,
			program   : function () {
				return 'test data'
			}
		})
		executeFunction(task, task.program(), {filePath: filePath}, 0, function () {
			assert.equal(fs.readFileSync(filePath, {encoding: 'utf-8'}), 'test data')
			done()
		})
	})

	it('_executeFunction: throw error', function (done) {
		var filePath = temp.openSync().path
		var task = WatcherTask.create({
			outputPath: filePath,
			program   : function () {
				throw 'test error'
			}
		})
		executeFunction(task, task.program(), {filePath: filePath}, 0, function (err) {
			assert.equal(err, 'test error')
			done()
		})
	})


	it('_executeCommand', function () {
		assert.ok(true)
	})


	it('_outputFile()', function (done) {
		var filePath = temp.openSync().path
		var task = WatcherTask.create({
			outputPath: filePath // 绝对路径
		})

		outputFile(task, {}, 1, 'test data', function (err) {
			assert.ok(!err)
			assert.equal(fs.readFileSync(filePath, {encoding: 'utf-8'}), 'test data')
			done()
		})

	})
})