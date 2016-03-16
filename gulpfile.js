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
var buildDirFile = buildDir + '/bower/' + buildFile;

// Tasks
//-----------------------------------------------
gulp.task('browserify', ['build'], function () {
  var extensions = ['.js'];
  return browserify({
    debug: true,
    extensions: extensions,
    standalone: 'lodashExtras',
    entries: ['./dist/src/index.js']
  })
    .bundle()
    .pipe(source(buildFile))
    .pipe(gulp.dest(buildDir + '/bower'));
});
gulp.task('build', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(buildDir + '/src'))
});
gulp.task('buildTests', function () {
  return gulp.src(['./tests/**/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(buildDir + '/tests'))
});

gulp.task('test', ['build', 'buildTests'], function () {
  return gulp.src('dist/tests/tests.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('compress', ['browserify'], function () {
  return gulp.src(buildDirFile)
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(buildDir + '/bower'));
});

gulp.task('watch', ['browserify'], function () {
  gulp.watch('src/**/*.js', ['build']);
});

gulp.task('dist', ['compress']);
gulp.task('default', ['watch']);
