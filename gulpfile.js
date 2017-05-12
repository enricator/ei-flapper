var gulp          = require('gulp');
var notify        = require('gulp-notify');
var concat 		  = require('gulp-concat');
var sass 		  = require('gulp-sass');
var useref 		  = require('gulp-useref');
var browserSync   = require('browser-sync').create();
var del 		  = require('del');

// Where our files are located
var paths = {
    jsFiles: 'src/js/**/*.js',
    cssFiles: "src/scss/**/*.css",
    sassFiles: "src/scss/**/*.scss",
    fontFiles: "src/fonts/**/*",
    index: 'src/index.html',
    distDev: './build',
    distProd: './dist',
    distScriptsProd: './dist.prod/scripts',
    scriptsDevServer: 'devServer/**/*.js'
};


var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};


gulp.task('js', function () {
  return gulp.src(paths.jsFiles)
  	.on('error', interceptErrors)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.distDev))
});

gulp.task('sass', function(){
  return gulp.src(paths.sassFiles)
  	.on('error', interceptErrors)
    .pipe(sass()) // Using gulp-sass
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.distDev))
});

gulp.task('fonts', function() {
  return gulp.src(paths.fontFiles)
  .pipe(gulp.dest(paths.distDev + '/fonts'))
});

gulp.task('html_orig', function() {
  return gulp.src(paths.index)
      .on('error', interceptErrors)
      .pipe(gulp.dest(paths.distDev));
});

gulp.task('html', function(){
  return gulp.src(paths.index)
  	.on('error', interceptErrors)
    .pipe(useref())
    .pipe(gulp.dest(paths.distDev))
});

gulp.task('clean:build', function() {
  return del.sync(paths.distDev);
})

gulp.task('default', ['clean:build', 'fonts', 'js', 'sass', 'html'], function() {

  browserSync.init([paths.distDev + '/**/**.**'], {
    server: paths.distDev,
    port: 4000,
    notify: false,
    ui: {
      port: 4001
    }
  });

  gulp.watch(paths.index, ['html']);
  gulp.watch(paths.jsFiles, ['js', 'html']);
  gulp.watch(paths.sassFiles, ['sass', 'html']);
});
