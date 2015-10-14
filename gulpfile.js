'use strict';

var gulp      = require( 'gulp' );
var jasmine   = require( 'gulp-jasmine');
var jshint    = require( 'gulp-jshint');
var jscs      = require('gulp-jscs');

require('gulp-release-tasks')(gulp);

gulp.task('test', function () {
  return gulp.src(['test/**/*.spec.js'])
        .pipe(jasmine());
});

gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js', './test/**/*.js', './index.js'])
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'))
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('default', () => {
  return gulp.src('src/app.js')
    .pipe(gulp.dest('src'));
});
