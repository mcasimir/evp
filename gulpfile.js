'use strict';

var gulp      = require( 'gulp' );
var jasmine   = require( 'gulp-jasmine');
var jshint    = require( 'gulp-jshint');

require('gulp-release-tasks')(gulp);

gulp.task('test', function () {
    return gulp.src(['test/**/*.spec.js'])
        .pipe(jasmine());
});

gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
