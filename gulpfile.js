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
    //entries: ['./src/index.js', './src/main.js']
    entries: './src/main.js'
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

gulp.task('buildTestSrc', function () {
    return gulp.src(['./src/**/*.js', '!./src/index.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(testSrcDir));
});

gulp.task('buildTest', function () {
    return gulp.src('./tests/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(testsDir));
});

gulp.task('test', ['buildTest', 'buildTestSrc'], function () {
    return gulp.src(testsDir + '/**/*.js', { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        expect: require('chai').expect
      }
    }));
});

gulp.task('watch', ['build'], function () {
  gulp.watch('src/**/*.js', ['build']);
});

gulp.task('dist', ['build', 'compress']);
gulp.task('default', ['watch']);
