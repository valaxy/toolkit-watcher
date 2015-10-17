var projectWatcher = require('./project-watcher'),
    configWatcher = require('./config-watcher')


module.exports = function (args) {
	var root = args.project
	projectWatcher.init(root)
	configWatcher.init(projectWatcher)
	projectWatcher.start()
	configWatcher.start()
}