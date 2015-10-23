var assert          = require('assert'),
    WatcherTask     = require('../../lib/model/watcher-task'),
    temp            = require('temp').track(),
    fs              = require('fs-extra'),
    executeFunction = require('../../lib/task/execute')._executeFunction


describe('executeTask', function () {
	it('_executeFunction', function () {
		// function return nothing
		var task = WatcherTask.create({
			program: function () {
				assert.ok(true)
			}
		})
		executeFunction(task, task.program(), {filePath: 'xx'})

		// function return content
		var filePath = temp.openSync().path
		var task = WatcherTask.create({
			outputPath: filePath,
			program   : function () {
				return 'test data'
			}
		})
		executeFunction(task, task.program(), {filePath: filePath})
		assert.equal(fs.readFileSync(filePath, {encoding: 'utf-8'}), 'test data')
	})


	it('_executeCommand', function () {
		assert.ok(true)
	})
})