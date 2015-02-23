var gulp = require('gulp');

gulp.task('default', ['build']);
gulp.task('build', ['test', 'minify', 'docs']);

gulp.task('minify', function () {
  var uglify = require('gulp-uglify'),
      rename = require('gulp-rename');

  return gulp.src('namespace.js')
             .pipe(uglify())
             .pipe(rename('namespace.min.js'))
             .pipe(gulp.dest('.'));
});

gulp.task('docs', function () {
  var docco = require('gulp-docco');

  return gulp.src('namespace.js')
             .pipe(docco())
             .pipe(gulp.dest('docs'));
});

gulp.task('test', function (done) {
  var argv = require('yargs').argv;
  var karma = require('karma').server;
  
  karma.start({
    files: ['mocks.js', 'namespace.js', 'spec.js'],
    singleRun: !argv.keepalive,
    browsers: ['PhantomJS'],
    reporters: ['spec'],
    frameworks: ['jasmine']
  }, done);
});
