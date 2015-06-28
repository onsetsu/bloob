module.exports = function (config) {
	config.set({
		basePath : '',
		frameworks: ['jasmine', 'requirejs'],
        files: [
//			'../lib/**/*.js',
//			'../test/spec/*.js'
            {pattern: '../test/test-main.js', included: true},
            {pattern: '../test/spec/*.js', included: false},
            {pattern: '../lib/**/*.js', included: false},
        ],
        exclude: [
			'lib/requireconfig.js',
			'karma.conf.js'
        ],
		browsers : ['PhantomJS'],
		reporters : ['progress', 'spec', 'coverage', 'html'],
		preprocessors: {
			'../lib/**/*.js': 'coverage'
		},
		coverageReporter: {
			type : 'text'//,
			//dir : 'coverage/'
		},
		colors: true,
		//logLevel: config.LOG_DEBUG,
		htmlReporter: {
			outputFile: 'results/unit-tests.html'
		},
		singleRun: true,
		plugins : [
			'karma-spec-reporter',
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-coverage',
            'karma-htmlfile-reporter',
            'karma-requirejs'
		]
	});
};
