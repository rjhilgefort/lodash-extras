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
var pkg = require('./package.json');

// Configuration
//-----------------------------------------------
var buildDir = 'dist';
var clientDir = buildDir + '/client';
var serverDir = buildDir + '/server';
var tmpDir = 'tmp';
var buildtestsDir = tmpDir +'/tests';
var buildsrcDir = tmpDir +'/src';
var buildFile = pkg.name + '.js';
var buildFileWithEmber = pkg.name + '-w-ember.js';;
var buildDirFile = clientDir + buildFile;
var standaloneName = _.camelCase(pkg.name);
var alljs = '**/*.js';

// Function to remove ember from index.js
function removeEmber(content) {
  return _.replace(content, `import lodashEmber from './lodash-ember';`, `let lodashEmber;`);
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

gulp.task('buildWithEmber', ['cleanTmp'], function () {
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
    .pipe(gulp.dest(buildtestsDir))
});

gulp.task('cleanBuild', function () {
  return del([serverDir]);
});

gulp.task('cleanTmp', function () {
  return del([tmpDir]);
});

gulp.task('cleanTests', function () {
  return del([buildtestsDir]);
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
  return gulp.src([buildtestsDir + alljs, '!' + buildtestsDir + '/**/*ember*.js'], {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', ['browserify'], function () {
  gulp.watch('src/' + alljs, ['build']);
});

gulp.task('clean', ['cleanBuild', 'cleanTmp', 'cleanTests', 'cleanClient']);
gulp.task('client', ['browserify','browserifyWithEmber']);
gulp.task('dist', ['compress']);
gulp.task('default', ['watch']);
