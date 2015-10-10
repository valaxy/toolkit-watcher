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
	//	// webstorm����
	//	isEnabled        : false,
	//	checkSyntaxErrors: '', // todo ��������������ʶ��syntax error
	//	description      : '', // human readable string for long text
	//	exitCodeBehavior : '', // show console
	//	fileExtension    : '',
	//	filter           : '', // glob matcher, ��֪���Ǹ�ʲô��
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
	//	trackOnlyRoot    : '', // todo �����֪���﷨�����ܷ�������
	//	workingDir       : '',
	//
	//	// �Զ���
	//	fileNameMatch: /\.jade$/, // execute program if fileName match
	//	filePathMatch: ''  // execute program if filePath match
	//},
	{
		isEnabled    : true,
		description  : '����JADE',
		program      : 'jade',
		arguments    : [
			'--out $FileDir',
			'$FilePath'
		],
		fileNameMatch: /\.jade$/
	},
	{
		isEnabled    : true,
		description  : '����SCSS',
		program      : 'sass',
		arguments    : [
			'--sourcemap=none',
			'--no-cache',
			'$FilePath',
			'${FileDir}/${FileNameWithoutExtension}.css'
		],
		fileNameMatch: /\.scss$/
	}
]
