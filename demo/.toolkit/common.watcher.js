var path    = require('path'),
    jade    = require('../../task/jade'),
    scss    = require('../../task/scss'),
    webpack = require('../../task/webpack')


module.exports = {
	matchOnFileRelativePath : [
		'**/*'
	],
	ignoreOnFileRelativePath: [
		/^excludes(\/.*)?$/,
		/^dest(\/.*)?$/
	],

	tasks: [
		jade({
			name                   : 'jade',
			description            : 'Compile jade to html',
			isEnabled              : true,
			arguments              : [
				'--out ${projectPath}/dest/${dirRelativePath}',
				'$filePath'
			],
			matchOnFileRelativePath: /\.jade$/
		}),
		scss({
			name                   : 'scss',
			description            : 'Compile scss to css',
			isEnabled              : true,
			arguments              : [
				'--sourcemap=none',
				'--no-cache',
				'$filePath',
				'${projectPath}/dest/${dirRelativePath}/${fileNameWithoutAllExtensions}.css'
			],
			matchOnFileRelativePath: /\.scss$/
		}),
		{
			name                   : 'jsx/es6',
			description            : 'Compile ecmascript6/jsx to js',
			isEnabled              : true,
			matchOnFileRelativePath: [
				/\.es6\.js$/,
				/\.jsx$/
			],
			program                : 'babel',
			arguments              : [
				'$filePath'
			],
			createOutputFromStdout : true,
			outputPath             : '${dirPath}/${fileNameWithoutAllExtensions}.js'
			//outputPath             : '${projectPath}/dest/${dirRelativePath}/${fileNameWithoutAllExtensions}.js'
		},
		webpack({
			name                   : 'webpack',
			isEnabled              : true,
			matchOnFileRelativePath: 'webpack/**/*.js',
			arguments              : [
				'$filePath',
				'${projectPath}/dest/${dirRelativePath}/${fileNameWithoutAllExtensions}.js'
			]
		})
	]
}


//{
//	// webstorm兼容
//	isEnabled        : false,
//	checkSyntaxErrors: '', // todo 这里的问题是如何识别syntax error
//	description      : '', // human readable string for long text
//	exitCodeBehavior : '', // show console
//	fileExtension    : '',
//	filter           : '', // glob matcher, 不知道是干什么的
//	immediateSync    : '',
//	name             : '', // human readable string for short text
//	output           : '',
//	outputFilters    : '',
//	outputFromStdout : '',
//	passParentEnvs   : '',
//	program          : 'jade', // shell command to execute
//	arguments        : [
//		'--out $FileDir',
//		'$FilePath'
//	], // string of string of array
//	scopeName        : '',
//	trackOnlyRoot    : '', // todo 如果不知道语法将不能发挥作用
//	workingDir       : '',

