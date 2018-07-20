var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifyes = require('gulp-uglifyes');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var del = require('del');

var paths = {
  styles: {
    src: 'src/origin/less/**/*.less',
    dest: 'src/vault/css/'
  },
  scripts: {
    src: 'src/origin/js/**/*.js',
    dest: 'src/vault/js/utils/'
  },
  pages: {
    src: 'src/origin/html/**/*.html',
    dest: 'src/vault/html/'
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

function pages() {
  return gulp.src(paths.pages.src)
    .pipe(htmlmin({collapseWhitespace: true}))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest(paths.pages.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.pages.src, pages);
}



function build() {
  return gulp.series(gulp.parallel(styles, scripts, pages));
}

/* --- */

exports.styles = styles;
exports.scripts = scripts;
exports.pages = pages;
exports.watch = watch;

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('pages', pages);
gulp.task('watch', watch);

gulp.task('build', build);
gulp.task('default', build);
