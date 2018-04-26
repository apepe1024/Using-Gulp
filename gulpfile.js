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

gulp.task("concatScripts", function() {
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

gulp.task("minifyScripts", ["concatScripts"], function() {
    return gulp.src('js/all.js')
     .pipe(uglify())
     .pipe(rename('all.min.js'))
     .pipe(gulp.dest('js'));
});

gulp.task("scripts", ["concatScripts", "minifyScripts"], function() {
    return gulp.src('js/all.min.js')
     .pipe(gulp.dest('dist'));
});

gulp.task("concatStyles", function() {
    return gulp.src("sass/global.scss")
     .pipe(maps.init())
     .pipe(sass())
     .pipe(rename('all.css'))
     .pipe(maps.write('./'))
     .pipe(gulp.dest('css'));
});

gulp.task("uglifyStyles", ["concatStyles"], function() {
    return gulp.src("css/all.css")
     .pipe(cleanCSS())
     .pipe(rename('all.min.css'))
     .pipe(maps.write('./'))
     .pipe(gulp.dest('css'));
});

gulp.task('styles', ["concatStyles", "uglifyStyles"], function() {
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

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./index.html')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./sass/**/*.scss'], ['styles', 'html']);
});

gulp.task('disconnect', function() {
  connect.serverClose();
});

gulp.task('clean', function() {
  del(['dist/clean', 'dist/*', './dist',  'css/*.css*', 'js/*.js*']);
});

gulp.task("build", ['clean', 'html', 'images', 'scripts', 'styles', 'connect']);

gulp.task("default", ["build", 'connect', 'watch']);
