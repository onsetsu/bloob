var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var shell = require('gulp-shell');

gulp.task('lint', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jsdoc', shell.task(['./node_modules/jsdoc/jsdoc .']));

gulp.task('default', ['lint', 'jsdoc']);
