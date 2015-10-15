'use strict';

var gulp      = require('gulp' );
var jasmine   = require('gulp-jasmine');
var jshint    = require('gulp-jshint');
var jscs      = require('gulp-jscs');
var seq       = require('gulp-sequence');
var depcheck  = require('depcheck');
var gutil     = require('gulp-util');
var PluginError = gutil.PluginError;

require('gulp-release-tasks')(gulp);

gulp.task('test', function () {
  return gulp.src(['test/**/*.spec.js'])
        .pipe(jasmine());
});

gulp.task('jscs', function() {
  return gulp.src(['./src/**/*.js', './test/**/*.js', './*.js'])
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('jshint', function() {
  return gulp.src(['./src/**/*.js', './test/**/*.js', './*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter())
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint', seq('jshint', 'jscs'));

gulp.task('ci', seq('depcheck', 'lint', 'test'));

gulp.task('default', () => {
  return gulp.src('src/app.js')
    .pipe(gulp.dest('src'));
});

gulp.task('depcheck', depCheck({
  ignoreDirs: [
    'node_modules',
    'bower_components',
    'docs'
  ],
  ignoreMatches: ['glob']
}));

function depCheck(options) {
  return function(){
    return new Promise(function(resolve, reject) {
      depcheck(__dirname, options, function(unused) {
        if (Object.keys(unused.invalidFiles).length) {
          reject(new Error(`Unable to parse some files: ${unused.invalidFiles.join(', ')}`));
          return;
        }
        if (unused.dependencies.length || unused.devDependencies.length) {
          var unusedDeps = unused.dependencies.concat(unused.devDependencies);

          var message = [
            gutil.colors.red(`You have some unused dependencies:  ${unusedDeps.join(', ')}'`),
            `Pass { ignoreMatches: ${JSON.stringify(unusedDeps).replace(/"/g, '\'')} } in plugin options to ignore this error`
          ].join('\n');

          return reject(new PluginError('depcheck', message, { showStack: false }));
        }
        resolve();
      });
    });
  };
}
