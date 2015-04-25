'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var browserify = require('gulp-browserify');
var lazypipe = require('lazypipe');

var paths = {
	css: {
		src:  './src/scss/**/*.scss',
		main: './src/scss/main.scss',
		dest: './build/css',
		maps: '/scss'
	},
	dest: './build',
	html: {
		src: './src/*.html',
		dest: './build'
	},
	js: {
		src:  './src/js/**/*.js',
		main: './src/js/main.js',
		dest: './public/js',
		maps: '/jsx'
	}
};

function handleError(err) {
	gutil.log(err.toString());
	this.emit('end');
}

gulp.task('clean', function () {
	return del(paths.dest, { force: true });
});

/**
 * CSSS Vendor Libraries
 *
 * Concat vendor libs into vendor.css
 */
gulp.task('css-vendor', function() {
  return gulp.src([
      './src/lib/**/*.css',
      '!./src/lib/**/*min.js'
  ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('css-vendor-min', function() {
  return gulp.src([
      './src/lib/**/*min.js'
  ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});

/**
 * Application scss compilation
 *
 * Compile scss and concat into app.css
 */
gulp.task('scss', function () {
    // NOTE: we only include style.scss on purpose, it includes other scss
    // files in the correct order
    gulp.src('./src/scss/style.scss')
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('scss-min', function () {
    // NOTE: we only include style.scss on purpose, it includes other scss
    // files in the correct order
    gulp.src('./src/scss/style.scss')
        .pipe(sass())
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./build/css/'));
});

/**
 * Javascript Vendor Libraries
 *
 * Concat vendor libs into vendor.js
 */
gulp.task('javascript-vendor', function() {
  return gulp.src([
      './src/lib/**/*.js',
      './src/lib/**/*.src',
      './src/lib/**/*.map',
      './src/lib/**/*.json',
      '!./src/lib/**/*min.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('javascript-vendor-min', function() {
  return gulp.src([
      './src/lib/**/*min.js',
      './src/lib/**/*.src',
      './src/lib/**/*.map',
      './src/lib/**/*.json'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build/js'));
});

/**
 * Javascript Application Libraries
 *
 * Concat application into app.js
 */
//var jsTransform = lazypipe()
//  .pipe(jshint)
//  .pipe(jshint.reporter, stylish)
//  .pipe(uglify);

//gulp.task('javascript-app-js', function() {
//  return gulp.src('./src/js/**/app.js')
//      .pipe(browserify({
//          //insertGlobals : true,
//          //transform: ['coffeeify'],
//          //extensions: ['.coffee'],
//          debug : !gulp.env.production
//        }))
//      .pipe(gulp.dest('./build/js'));
//});

gulp.task('javascript-app-coffee', function() {
  return gulp.src('./src/js/**/app.js')
      .pipe(browserify({
          //insertGlobals : true,
          transform: ['coffeeify'],
          extensions: ['.coffee'],
          debug : !gulp.env.production
        }))
      .pipe(gulp.dest('./build/js'));
});

gulp.task('build-dev', [
    'scss',
    'css-vendor',
    'javascript-vendor'
    //'javascript-app'
]);
gulp.task('build-prod', [
    'scss-min',
    'css-vendor-min',
    'javascript-vendor-min'
    //'javascript-app-min'
]);

gulp.task('default', ['build-dev']);