//
// CLI tool
//

require('colors')
var commander = require('commander'),
    fs        = require('fs-extra'),
    main      = require('./lib/main'),
    path      = require('path'),
    logger    = require('./lib/log').get()


logger.openConsole()
var pkg = fs.readJsonSync(__dirname + '/package.json')
commander
	.version(pkg.version)
	.option('--project <project>', 'project root')
	.parse(process.argv)


if (!commander.project) {
	commander.project = process.cwd()
} else if (!path.isAbsolute(commander.project)) {
	commander.project = path.join(__dirname, commander.project)
}


console.info('project'.cyan, commander.project)
main(commander)