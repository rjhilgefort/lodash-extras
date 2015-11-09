var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
  var extensions = ['.js'];
  return browserify({
    debug: true,
    extensions: extensions,
    entries: './src/index.js'
  })
    .transform(babelify.configure({
      extensions: extensions
    }))
    .bundle()
    .pipe(source('lodash-extras.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function () {
  gulp.watch('src/*.js', ['build']);
});

gulp.task('default', ['watch']);
