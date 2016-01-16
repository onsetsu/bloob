module.exports = function (config) {
	config.set({
		basePath : '',
		frameworks: ['jasmine', 'requirejs'],
        files: [
            'test-main.js',
			'lib/external/miniclass.js',
			'lib/external/jquery.js',
			'lib/external/jquery-ui-1.8.1.custom.min.js',
			'lib/external/underscore.js',
			'lib/external/d3.js',
			'lib/external/stats.js',
			'lib/external/dat.gui.js',
			'lib/external/tweenjs-0.5.1.min.js',
			'lib/external/preloadjs-0.4.1.min.js',
			'lib/external/paper-full.js',
			'lib/external/toxiclibs.js',
			'lib/external/screenfull.js',
			{pattern: 'test/**/*test.js', included: false},
            {pattern: 'lib/**/*.js', included: false}
        ],
        exclude: [
			'lib/requireconfig.js',
			'karma.conf.js'
        ],
		//browsers : ['PhantomJS'],
		browsers: ['Chrome'],

		customLaunchers: {
			Chrome_Travis_CI: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},

		reporters : ['progress', 'spec', 'coverage', 'html'],
		preprocessors: {
            'lib/**/*.js': ['coverage']
        },
        coverageReporter: {
			type : 'text'//,
			//dir : 'coverage/'
		},
		colors: true,
		logLevel: config.LOG_DEBUG,
		htmlReporter: {
			outputFile: 'results/unit-tests.html'
		},
		singleRun: true,
		plugins : [
			'karma-spec-reporter',
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-jasmine',
			'karma-coverage',
            'karma-htmlfile-reporter',
            'karma-requirejs'
		]
	});

	if(process.env.TRAVIS) {
		config.browsers = ['Chrome_Travis_CI'];
	}
};
