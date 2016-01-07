var gulp = require('gulp'),
    concat = require('gulp-concat'),
    buildSources = require('./tools/sources.json'),
    jshint=require('gulp-jshint'),
    gulpFilter = require('gulp-filter'),
    libs = [
	'bower_components/jquery/dist/jquery.min.js',
	'bower_components/knockout/dist/knockout.js',
	'bower_components/requirejs/require.js',
	'bower_components/requirejs-text/text.js',
	'bower_components/sammy/lib/min/sammy-latest.min.js'
];

gulp.task('default',['build']);

gulp.task('copy-libs', function () {
    return gulp.src(libs)
      .pipe(gulp.dest('src/lib'))
});

gulp.task('jshint', function(){
    var filter = gulpFilter('**/*.js');
   return gulp.src(buildSources)
       .pipe(filter)
       .pipe(jshint())
       .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build',['copy-libs'], function(){
	return gulp.src(buildSources)
        .pipe(concat('knockout-mvc.js'))
		.pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function(){
   return gulp.watch(buildSources, ['build','jshint']);
});