var commander = require('commander'),
    fs        = require('fs'),
    main      = require('./lib/main')


var pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json', {encoding: 'utf-8'}))
commander
	.version(pkg.version)
	.option('--project <project>', 'project root')
	.parse(process.argv)


if (!commander.project) {
	console.error('argument project needed')
	return
}


main(commander)