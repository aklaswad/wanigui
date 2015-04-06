var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('ghPages', function () {
  return gulp.src(['./site/**/*','./wanigui.all.min.js'])
    .pipe(ghPages());
});

gulp.task('coffee', function() {
  gulp.src('./lib/**/*.coffee')
    .pipe(coffee())
      .on('error',gutil.log)
    .pipe(gulp.dest('./js/'));
});

gulp.task('coffee-deploy', function() {
  gulp.src('./lib/**/*.coffee')
    .pipe(coffee())
      .on('error',gutil.log)
    .pipe(gulp.dest('./site/'));
});

gulp.task('concat', function () {
  gulp.src(['js/wanigui.js','js/module-basic.js','./js/knob.js','./js/keyboard.js'])
    .pipe(concat('wanigui.all.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('uglify', function () {
  gulp.src('js/wanigui.all.js')
    .pipe(uglify())
    .pipe(rename('wanigui.all.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('build', function () {
  gulp.run('coffee', function () {
    gulp.run('concat', function () {
      gulp.run('uglify', function () {})
    })
  })
});

gulp.task('deploy', function () {
  gulp.run('coffee-deploy', function () {
    gulp.run('ghPages', function () {})
  })
});
