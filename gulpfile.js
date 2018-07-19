var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifyes = require('gulp-uglifyes');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var gutil = require('gulp-util');
var del = require('del');

var paths = {
  styles: {
    src: 'src/origin/less/**/*.less',
    dest: 'src/vault/css/'
  },
  scripts: {
    src: 'src/origin/js/**/*.js',
    dest: 'src/vault/js/utils/'
  }
};

/* --- */

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

function build() {
  return gulp.series(gulp.parallel(styles, scripts));
}

/* --- */

exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', build);
gulp.task('default', build);
