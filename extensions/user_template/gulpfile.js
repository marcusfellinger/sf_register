'use strict'

const gulp = require('gulp'), sassLint = require('gulp-sass-lint');
const sass = require('gulp-sass')(require('sass'));

function javascript (cb) {
  // body omitted
  cb()
}

function css (cb) {
  return gulp.src('Resources/Private/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('Resources/Public/Css'));
}

function sasslint () {
  return gulp.src('Resources/Private/sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
}

gulp.task('default', gulp.parallel(javascript, sasslint, css))
