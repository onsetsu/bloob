var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

//var shell = require('gulp-shell');

var karma = require('gulp-karma');

gulp.task('lint', function () {
  return gulp.src('lib/!(external)**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Run unit tests
gulp.task('test', function(done) {
  return gulp.src(
//  [
//    //'./lib/external/require.js',
//    './test/**/*.js',
//    './test/test-main.js'
//  ]
//  )
//    .pipe(karma({ configFile: 'test/karma.conf.js' }))
//    .on('error', function(err) { throw err; });
  karma.start({
    configFile: 'test/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', ['lint', 'test']);
