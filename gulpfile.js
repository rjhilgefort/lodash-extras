// Dependencies
//-----------------------------------------------
var _ = require('lodash');
var gulp = require('gulp');
var browserify = require('browserify');
var change = require('gulp-change');
var del = require('del');
var source = require('vinyl-source-stream');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var pkg = require('./package.json');

// Configuration
//-----------------------------------------------
var buildDir = 'dist';
var clientDir = buildDir + '/client';
var serverDir = buildDir + '/server';
var tmpDir = 'tmp';
var testsDir = tmpDir + '/tests';
var clientTests = testsDir + '/client';
var serverTests = testsDir + '/server';
var buildsrcDir = tmpDir + '/src';
var buildFile = pkg.name + '.js';
var buildFileWithEmber = pkg.name + '-w-ember.js';;
var buildDirFile = clientDir + buildFile;
var standaloneName = _.camelCase(pkg.name);
var alljs = '**/*.js';

// Function to remove ember from index.js
function removeEmber(content) {
  return _.replace(content, 'import lodashEmber from \'./lodash-ember\';', 'let lodashEmber;');
};

// Tasks
//-----------------------------------------------
gulp.task('browserifyWithEmber', ['buildWithEmber', 'cleanClient'], function () {
  var extensions = ['.js'];

  return browserify({
    debug: true,
    extensions: extensions,
    standalone: standaloneName,
    entries: [buildsrcDir + '/index.js']
  })
    .bundle()
    .pipe(source(buildFileWithEmber))
    .pipe(gulp.dest(clientDir));
});

gulp.task('browserify', ['build', 'cleanClient'], function () {
  var extensions = ['.js'];

  return browserify({
    debug: true,
    extensions: extensions,
    standalone: standaloneName,
    entries: [pkg.main]
  })
    .bundle()
    .pipe(source(buildFile))
    .pipe(gulp.dest(clientDir));
});

gulp.task('browserifyTests', ['buildTests'], function () {
  var extensions = ['.js'];

  return browserify({
    debug: true,
    extensions: extensions,
    standalone: standaloneName,
    entries: [serverTests + '/tests.js']
  })
    .bundle()
    .pipe(source('browserTests.js'))
    .pipe(gulp.dest(clientTests));
});

gulp.task('buildWithEmber', ['cleanTmpSrc'], function () {
  return gulp.src(['./src/' + alljs])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(buildsrcDir))
});

gulp.task('build', ['cleanBuild'], function () {
  return gulp.src(['./src/' + alljs, '!./src/**/*ember*.js'])
    .pipe(change(removeEmber))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(serverDir))
});

gulp.task('buildTests', ['cleanTests'], function () {
  return gulp.src(['./tests/' + alljs])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(serverTests))
});

gulp.task('buildClientTests', ['browserifyTests'], function () {
  return gulp.src(['./tests/runner.html'])
    .pipe(gulp.dest(clientTests))
});

gulp.task('cleanBuild', function () {
  return del([serverDir]);
});

gulp.task('cleanTmpSrc', function () {
  return del([buildsrcDir]);
});

gulp.task('cleanTests', function () {
  return del([testsDir]);
});

gulp.task('cleanClient', function () {
  return del([clientDir]);
});

gulp.task('compress', ['client'], function () {
  return gulp.src(clientDir+ alljs)
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(buildDir));
});

gulp.task('testServer', ['build', 'buildTests'], function () {
  return gulp.src([serverTests + alljs, '!' + serverTests + '/**/*ember*.js'], {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('testClient', ['dist', 'buildClientTests'], function () {
  return gulp.src(clientTests + '/runner.html')
    .pipe(mochaPhantomJS({reporter: 'spec'}));
});

gulp.task('watch', ['testServer'], function () {
  gulp.watch('src/' + alljs, ['testServer']);
});

gulp.task('clean', ['cleanBuild', 'cleanTmpSrc', 'cleanTests', 'cleanClient']);
gulp.task('client', ['browserify','browserifyWithEmber']);
gulp.task('dist', ['compress']);
gulp.task('default', ['watch']);
