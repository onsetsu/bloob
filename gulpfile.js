var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

//var shell = require('gulp-shell');

var karma = require('gulp-karma');

gulp.task('lint', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Run unit tests
gulp.task('test:scripts', function() {
  return gulp.src('./test/**/*.js')
    .pipe(karma({ configFile: 'karma.conf.js' }))
    .on('error', function(err) { throw err; });
});

gulp.task('default', ['lint']);
