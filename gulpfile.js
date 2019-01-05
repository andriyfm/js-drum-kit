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
const gulpBase64 = require("gulp-to-base64")

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

// Comporess and Minify Sound Files
const base64Task = () => {
  return src('src/audio/*.{mp3,wav,WAV}')
    .pipe(gulpBase64({ size: true, outPath: 'dist/drum-kit.json.js' }))
    .pipe(dest('dist/audio/'))
}

// Compile pug file into html file
const pugTask = () => {
  return src(['src/pug/index.pug'])
    .pipe(pug({
      pretty: true,
      data: {
        title: 'Javascript Drum Kit',
        keys: [{
          char: 'Q', code: '81', audio: 'audio/SynDr101.WAV'
        },{
          char: 'W', code: '87', audio: 'audio/SynDr102.WAV'
        },{
          char: 'E', code: '69', audio: 'audio/SynDr103.WAV'
        },{
          char: 'R', code: '82', audio: 'audio/SynDr104.WAV'
        },{
          char: 'T', code: '84', audio: 'audio/SynDr105.WAV'
        },{
          char: 'Y', code: '89', audio: 'audio/SynDr106.WAV'
        },{
          char: 'A', code: '65', audio: 'audio/SynDr113.WAV'
        },{
          char: 'S', code: '83', audio: 'audio/SynDr108.WAV'
        },{
          char: 'D', code: '68', audio: 'audio/SynDr109.WAV'
        },{
          char: 'F', code: '70', audio: 'audio/SynDr110.WAV'
        },{
          char: 'G', code: '71', audio: 'audio/SynDr111.WAV'
        },{
          char: 'H', code: '72', audio: 'audio/SynDr112.WAV'
        }]
      }
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
    .pipe(dest('/js/'))
}

const watchTask = () => {
  return watch(
    [
      'src/sass/**/*.scss',
      'src/pug/index.pug',
      'src/js/module1.js',
    ],
    series(
      parallel(sassTask, minifySassTask),
      parallel(bundleJavascriptTask),
      pugTask,
      base64Task,
      minifyImageTask
    )
  )
}

exports.default = series(cleanTask, watchTask)