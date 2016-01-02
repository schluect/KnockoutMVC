var gulp = require('gulp'),
    concat = require('gulp-concat'),
    buildSources = require('./tools/sources.json');
var libs = [
	'bower_components/jquery/dist/jquery.min.js',
	'bower_components/knockout/dist/knockout.js',
	'bower_components/requirejs/require.js',
	'bower_components/requirejs-text/text.js',
	'bower_components/sammy/lib/min/sammy-latest.min.js'
]
gulp.task('copy-libs', function () {
    return gulp.src(libs)
      .pipe(gulp.dest('src/lib'))
});

gulp.task('build', function(){
	return gulp.src(buildSources)
        .pipe(concat('knockout-mvc.js'))
		.pipe(gulp.dest('./dist/'))
});