// Dependencies
//-----------------------------------------------
var _ = require('lodash');
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var mocha = require('gulp-mocha');
var pkg = require('./package.json');

// Configuration
//-----------------------------------------------
var buildDir = 'dist';
var testsDir = 'distTest' +'/tests';
var testSrcDir = 'distTest' +'/src';
var buildFile = pkg.name + ".js";
var buildDirFile = buildDir + '/' + buildFile;

// Tasks
//-----------------------------------------------
gulp.task('build', function () {
  var extensions = ['.js'];
  return browserify({
    debug: true,
    extensions: extensions,
    entries: ['./src/index.js']
  })
    .transform(babelify.configure({
      extensions: extensions
    }))
    .bundle()
    .pipe(source(buildFile))
    .pipe(gulp.dest(buildDir));
});

gulp.task('compress', ['build'], function () {
  return gulp.src(buildDirFile)
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(buildDir));
});

gulp.task('watch', ['build'], function () {
  gulp.watch('src/**/*.js', ['build']);
});

gulp.task('dist', ['build', 'compress']);
gulp.task('default', ['watch']);
