var projectWatcher = require('./project-watcher'),
    toolboxWatcher = require('./toolbox-watcher')


module.exports = function (args) {
	var root = args.project
	projectWatcher.init(root)
	toolboxWatcher.init(projectWatcher)
	projectWatcher.start()
	toolboxWatcher.start()
}