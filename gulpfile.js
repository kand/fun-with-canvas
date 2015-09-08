var connect = require('gulp-connect');
var del = require('del');
var gulp = require('gulp');

gulp.task('del:tmp', function () {
  return del('.tmp');
});

gulp.task('copy:prep', ['del:tmp']);

gulp.task('copy:src:js', ['copy:prep'], function () {
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('.tmp/pre-dist/scripts'));
});

gulp.task('copy:src:styles', ['copy:prep'], function () {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('.tmp/pre-dist/styles'));
});

gulp.task('copy:example:html', ['copy:prep'], function () {
  return gulp.src('example/*.html')
    .pipe(gulp.dest('.tmp/pre-dist'));
});

gulp.task('copy:example:js', ['copy:prep'], function () {
  return gulp.src('example/*.js')
    .pipe(gulp.dest('.tmp/pre-dist/scripts'));
});

gulp.task('copy:example:styles', ['copy:prep'], function () {
  return gulp.src('example/*.css')
    .pipe(gulp.dest('.tmp/pre-dist/styles'));
});

gulp.task('copy:src', [
  'copy:src:js',
  'copy:src:styles'
]);

gulp.task('copy:example', [
  'copy:example:html',
  'copy:example:js',
  'copy:example:styles'
]);

gulp.task('connect:prep', [
  'copy:prep',
  'copy:example',
  'copy:src'
]);

gulp.task('connect', ['connect:prep'], function () {
  connect.server({
    root: '.tmp/pre-dist',
    livereload: true,
    middleware: function (connect) {
      return [
        connect.static('.tmp/pre-dist'),
        connect().use('/d', connect.static('node_modules'))
      ];
    }
  });
});

gulp.task('watch', ['connect'], function () {
  gulp.watch(['**'], [
    'copy:src',
    'copy:example'
  ])
    .on('change', function () {
      connect.reload();
    });
});

gulp.task('serve:example', [
  'connect:prep',
  'connect',
  'watch'
]);
