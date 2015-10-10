//{
//    "version": "0.0.1",
//    "tasks":   [
//        {
//            "isEnabled": true
//        }
//    ]
//}
//

module.exports = [
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
	//	fileNameMatch: /\.jade$/, // execute program if fileName match
	//	filePathMatch: ''  // execute program if filePath match
	//},
	{
		isEnabled    : true,
		description  : '编译JADE',
		program      : 'jade',
		arguments    : [
			'--out $DirPath',
			'$FilePath'
		],
		fileNameMatch: /\.jade$/
	},
	{
		isEnabled    : true,
		description  : '编译SCSS',
		program      : 'sass',
		arguments    : [
			'--sourcemap=none',
			'--no-cache',
			'$FilePath',
			'${DirPath}/${FileNameWithoutAllExtensions}.css'
		],
		fileNameMatch: /\.scss$/
	}
]
