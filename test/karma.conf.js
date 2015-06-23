module.exports = function (config) {
	config.set({
		basePath : './',
		frameworks: ['jasmine'],
	        files: [
			'lib/*.js',
			'test/spec/*.js'
	        ],
	        exclude: [
			'test/karma.conf.js'
	        ],
		browsers : ['PhantomJS'],
		reporters : ['spec', 'coverage', 'html'],
		preprocessors: {
			'../src/js/**/*.js': 'coverage'
		},
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		},
		htmlReporter: {
			outputFile: 'results/unit-tests.html'
		},
		singleRun: true,
		plugins : [
			'karma-spec-reporter',
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-coverage',
			'karma-htmlfile-reporter'
		]
	});
};
