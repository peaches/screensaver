var gulp = require('gulp');

var es6transpiler = require('gulp-es6-transpiler');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    host: '0.0.0.0',
    port: '1234',
    root: 'dist',
    livereload: true
  });
});

// Lint Task
gulp.task('lint', function() {
  return gulp.src('scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('scss/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src('scripts/*.js')
    .pipe(es6transpiler())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('all.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('html', function() {
  return gulp.src('index.html')
    .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('scripts/*.js', ['lint', 'scripts']);
  gulp.watch('index.html', ['html']);
  gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'html', 'scripts', 'watch']);
