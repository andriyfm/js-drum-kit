'use strict'

const { series, parallel, src, dest, watch } = require('gulp')
const clean = require('gulp-clean')
const babel = require('gulp-babel')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')

// Define sass compiler
sass.compiler = require('node-sass')

// Removing dist folder
const cleanTask = function () {
  return src('dist/**', { read: false })
    .pipe(clean())
}

// Compile sass/scss file into css file
const sassTask = function () {
  return src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('dist/css/'))
}

// Minify file sass
const minifySassTask = function () {
  return src('src/sass/style.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/css'))
}

// Compress and Minify Image
const minifyImageTask = () => {
  return src('src/img/**/*.jpg')
    .pipe(imagemin({ progressive: true }))
    .pipe(dest('dist/img/'))
}

// Compile pug file into html file
const pugTask = () => {
  return src(['src/pug/index.pug'])
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('dist/'))
}

// Compile js using babel
const bundleJavascriptTask = () => {
  return src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/js/'))
}

// Minify all js files
const minifyJavascriptTask = () => {
  return src('src/js/main.js')
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/js/'))
}

const watchTask = () => {
  return watch(
    [
      'src/sass/**/*.scss',
      'src/pug/index.pug',
      'src/js/main.js'
    ],
    series(
      minifyImageTask,
      parallel(sassTask, minifySassTask),
      parallel(bundleJavascriptTask),
      pugTask
    )
  )
}

exports.default = series(cleanTask, watchTask)