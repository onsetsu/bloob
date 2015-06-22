var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

     if(   jshint === stylish)    {
       
       3 + 42     }
       
       i = 2
  while(i++ <= 10)
  {
    17+42;
    
    
    
          }
          
gulp.task('lint', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshint()) // '.jshintrc'
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['lint']);
