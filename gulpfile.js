var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');


gulp.task('lint', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshint()) // '.jshintrc'
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['lint']);
