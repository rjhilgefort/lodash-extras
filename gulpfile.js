// Dependencies
//-----------------------------------------------
var _ = require('lodash');
var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var source = require('vinyl-source-stream');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var mocha = require('gulp-mocha');
var pkg = require('./package.json');

// Configuration
//-----------------------------------------------
var buildDir = 'dist';
var bowerDir = buildDir + '/bower';
var buildtestsDir = buildDir +'/tests';
var buildsrcDir = buildDir +'/src';
var buildFile = pkg.name + ".js";
var buildDirFile = buildDir + '/bower/' + buildFile;
var standaloneName = _.camelCase(pkg.name);
var alljs = '**/*.js';

// Tasks
//-----------------------------------------------
gulp.task('browserify', ['build', 'cleanBower'], function () {
  var extensions = ['.js'];

  return browserify({
    debug: true,
    extensions: extensions,
    standalone: standaloneName,
    entries: [pkg.main]
  })
    .bundle()
    .pipe(source(buildFile))
    .pipe(gulp.dest(bowerDir));
});
gulp.task('build', ['cleanBuild'], function () {
  return gulp.src(['./src/' + alljs])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(buildsrcDir))
});
gulp.task('buildTests', ['cleanTests'], function () {
  return gulp.src(['./tests/' + alljs])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(buildtestsDir))
});

gulp.task('cleanBuild', function () {
  return del([buildsrcDir]);
});

gulp.task('cleanTests', function () {
  return del([buildtestsDir]);
});

gulp.task('cleanBower', function () {
  return del([bowerDir]);
});


gulp.task('compress', ['browserify'], function () {
  return gulp.src(buildDirFile)
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(bowerDir));
});

gulp.task('test', ['build', 'buildTests'], function () {
  return gulp.src(buildtestsDir + alljs, {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', ['browserify'], function () {
  gulp.watch('src/' + alljs, ['build']);
});


gulp.task('dist', ['test', 'compress']);
gulp.task('default', ['watch']);
