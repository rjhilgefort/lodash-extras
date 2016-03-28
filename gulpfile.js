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

// Client-side processing Tasks
// Build client-side release
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

// Build client-side with release ember with ember
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

// Build client-side tests
gulp.task('browserifyTests', ['buildTests'], function () {
  var extensions = ['.js'];

  return browserify({
    debug: true,
    extensions: extensions,
    standalone: standaloneName,
    entries: [serverTests + '/index.js']
  })
    .bundle()
    .pipe(source('browserTests.js'))
    .pipe(gulp.dest(clientTests));
});

// Minify client-side release files
gulp.task('compress', ['client'], function () {
  return gulp.src(clientDir + alljs)
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(buildDir));
});

// Build Tasks
// Babelify code without Ember for server-side release
gulp.task('build', ['cleanBuild'], function () {
  return gulp.src(['./src/' + alljs, '!./src/**/*ember*.js'])
    .pipe(change(removeEmber))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(serverDir))
});

// Babelify code with Ember
gulp.task('buildWithEmber', ['cleanTmpSrc'], function () {
  return gulp.src(['./src/' + alljs])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(buildsrcDir))
});

// Babelify tests
gulp.task('buildTests', ['cleanTests'], function () {
  return gulp.src(['./tests/' + alljs])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(serverTests))
});

// Move test runner to test directory
gulp.task('buildClientTests', ['browserifyTests'], function () {
  return gulp.src(['./tests/runner.html'])
    .pipe(gulp.dest(clientTests))
});

// Clean Tasks

// Clean server-side release build
gulp.task('cleanBuild', function () {
  return del([serverDir]);
});

// Clean tmp src build
gulp.task('cleanTmpSrc', function () {
  return del([buildsrcDir]);
});

// Clean tmp test build
gulp.task('cleanTests', function () {
  return del([testsDir]);
});

// Clean client release build
gulp.task('cleanClient', function () {
  return del([clientDir]);
});

// Test Tasks
// Run server-side tests
gulp.task('testServer', ['build', 'buildTests'], function () {
  return gulp.src([serverTests + alljs, '!' + serverTests + '/**/*ember*.js', '!' + serverTests + 'index.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }));
});

// Run client-side test
gulp.task('testClient', ['dist', 'buildClientTests'], function () {
  return gulp.src(clientTests + '/runner.html')
    .pipe(mochaPhantomJS({ reporter: 'spec' }));
});

// Helper Tasks
// Watch changes to src and test severside on change
gulp.task('watch', ['testServer'], function () {
  gulp.watch('src/' + alljs, ['testServer']);
});

// Clean all build and test artifacts
gulp.task('clean', ['cleanBuild', 'cleanTmpSrc', 'cleanTests', 'cleanClient']);

// Build client-side releases
gulp.task('client', ['browserify','browserifyWithEmber']);

// Complete build for client and server
gulp.task('dist', ['build', 'client', 'compress']);

gulp.task('default', ['watch']);
