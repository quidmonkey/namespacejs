var gulp = require('gulp');

gulp.task('default', ['build']);

gulp.task('build', ['test', 'minify', 'docs', 'bump']);

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

gulp.task('bump', function(){
  var bump = require('gulp-bump');

  return gulp.src(['package.json'])
             .pipe(bump())
             .pipe(gulp.dest('.'));
});

gulp.task('test', function (done) {
  var argv = require('yargs').argv;
  var karma = require('karma').server;
  
  karma.start({
    files: ['namespace.js', 'spec.js'],
    singleRun: !argv.keepalive,
    browsers: ['PhantomJS'],
    reporters: ['spec'],
    frameworks: ['jasmine']
  }, done);
});
