var path = require('path')


var projectWatcher = require('./lib/project-watcher'),
    toolboxWatcher = require('./lib/toolbox-watcher')


if (!module.parent) {
	var ROOT = path.join(__dirname, './demo')
	projectWatcher.init(ROOT)
	toolboxWatcher.init(projectWatcher)
	projectWatcher.start()
	toolboxWatcher.start()
}

