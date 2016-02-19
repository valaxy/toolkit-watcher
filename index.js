#!/usr/bin/env node

//
// CLI tool
//

require('colors')
var commander = require('commander'),
    fs        = require('fs-extra'),
    main      = require('./lib/main'),
    path      = require('path'),
    logger    = require('./lib/log').openConsole()


var pkg = fs.readJsonSync(__dirname + '/package.json')
commander
	.version(pkg.version)
	.option('--project <project>', 'project root')
	.option('--buildAll', 'walk all watch files and build, but not keep watching')
	.parse(process.argv)

if (!commander.project) {
	commander.project = process.cwd()
} else if (!path.isAbsolute(commander.project)) {
	commander.project = path.join(__dirname, commander.project)
}


main(commander)