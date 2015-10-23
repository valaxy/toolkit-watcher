var path = require('path')

module.exports = {
	matchOnFileRelativePath : [
		'**/*'
	],
	ignoreOnFileRelativePath: [
		/^excludes(\/.*)?$/,
		/^dest(\/.*)?$/
	],

	tasks: [
		{
			isEnabled              : true,
			description            : '编译JADE',
			program                : 'jade',
			arguments              : [
				'--out ${projectPath}/dest/${dirRelativePath}',
				'$filePath'
			],
			matchOnFileRelativePath: /\.jade$/,
			dependFiles            : function (info) {
				var code = info.fileContent
				var REG = /include\s+([^\r\n\s]+)/g
				var result = []
				while (true) {
					var match = REG.exec(code)
					if (!match) break
					result.push(path.join(info.dirRelativePath, match[1] + '.jade'))  
				}
				return result
			}
		},
		{
			isEnabled              : true,
			description            : '编译SCSS',
			program                : 'sass',
			arguments              : [
				'--sourcemap=none',
				'--no-cache',
				'$filePath',
				'${dirPath}/${fileNameWithoutAllExtensions}.css'
			],
			matchOnFileRelativePath: /\.scss$/
		},
		{
			description            : 'compile ECMAScript 6',
			isEnabled              : true,
			matchOnFileRelativePath: /\.es6\.js$/,
			program                : 'babel',
			arguments              : [
				'$filePath'
			],
			createOutputFromStdout : true,
			outputPath             : '${projectPath}/dest/${dirRelativePath}/${fileNameWithoutAllExtensions}.js'
		}
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
//
//	// 自定义
//  excludes
//	fileNameMatch: /\.jade$/, // execute program if fileName match
//	filePathMatch: ''  // execute program if filePath match
//},