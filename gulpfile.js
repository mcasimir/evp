'use strict';

var gulp      = require( 'gulp' );
var jasmine   = require( 'gulp-jasmine');
var jshint    = require( 'gulp-jshint');
var shell     = require( 'gulp-shell');

gulp.task('test', function () {
    return gulp.src(['test/**/*.spec.js'])
        .pipe(jasmine());
});

gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});