var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');

//copy file to folder assets //write: gulp copy
gulp.task('copy', function() {
    gulp.src('app.js').pipe(gulp.dest('assets'));
});

//turn scss(sass) file to css //write: gulp sass
gulp.task('sass', function() {
    gulp.src('stylesheets/main.scss')
    .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
    .pipe(gulp.dest("assets"))
});