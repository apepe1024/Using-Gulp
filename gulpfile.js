"use strict";

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const connect = require('gulp-connect');
const del = require('del');

gulp.task("concatScripts", () => {
    return gulp.src([
        'js/circle/jquery.js',
        'js/circle/autogrow.js',
        'js/circle/circle.js'
        ])
     .pipe(maps.init())
     .pipe(concat('all.js'))
     .pipe(maps.write('./'))
     .pipe(gulp.dest('js'))
});

gulp.task("minifyScripts", ["concatScripts"], () => {
    return gulp.src('js/all.js')
     .pipe(uglify())
     .pipe(rename('all.min.js'))
     .pipe(gulp.dest('js'));
});

gulp.task("scripts", ["concatScripts", "minifyScripts"], () => {
    return gulp.src('js/all.min.js')
     .pipe(gulp.dest('dist'));
});

gulp.task("concatStyles", () => {
    return gulp.src("sass/global.scss")
     .pipe(maps.init())
     .pipe(sass())
     .pipe(rename('all.css'))
     .pipe(maps.write('./'))
     .pipe(gulp.dest('css'));
});

gulp.task("uglifyStyles", ["concatStyles"], () => {
    return gulp.src("css/all.css")
     .pipe(cleanCSS())
     .pipe(rename('all.min.css'))
     .pipe(maps.write('./'))
     .pipe(gulp.dest('css'));
});

gulp.task('styles', ["concatStyles", "uglifyStyles"], () => {
  return gulp.src("css/all.min.css")
      .pipe(gulp.dest('dist'));
});

gulp.task('images', () =>
  gulp.src([
      './images/*',
      './icons/*',
      './icons/svg/*'
      ])
   .pipe(imagemin())
   .pipe(gulp.dest('dist/content'))
);

gulp.task('connect', () => {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('html',  () => {
  gulp.src('./index.html')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch',  () => {
  gulp.watch(['./sass/**/*.scss'], ['styles', 'html']);
});

gulp.task('disconnect', () => {
  connect.serverClose();
});

gulp.task('clean', () => {
  del(['dist/clean', 'dist/*', './dist',  'css/*.css*', 'js/*.js*']);
});

gulp.task("build", ['clean', 'html', 'images', 'scripts', 'styles', 'connect']);

gulp.task("default", ["build", 'connect', 'watch']);
