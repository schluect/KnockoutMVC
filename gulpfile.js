var gulp = require('gulp'),
	blanket = require('blanket'),
    concat = require('gulp-concat'),
    buildSources = require('./tools/sources.json'),
	testSources = require('./tools/testSources.json'),
    jshint=require('gulp-jshint'),
    gulpFilter = require('gulp-filter'),
	uglify = require('gulp-uglify'),
	server = require( 'gulp-develop-server'),
	coveralls = require('gulp-coveralls'),
	istanbul = require('gulp-istanbul'),
	mocha = require('gulp-mocha'),
	mochalcovreporter = require('mocha-lcov-reporter'),
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

gulp.task('build.example',['build.dev'], function(){
	return gulp.src('./dist/*')
		.pipe(gulp.dest('./examples/lib'));
});

gulp.task('build.dev',['copy-libs'], function(){
	return gulp.src(buildSources)
		.pipe(concat('knockout-mvc.js'))
		.pipe(gulp.dest('./dist/'))
});

gulp.task('build.prod',['copy-libs'], function(){
	return gulp.src(buildSources)
		.pipe(concat('knockout-mvc.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/'))
});

gulp.task('build',['build.dev','build.prod']);

gulp.task('watch', function(){
   return gulp.watch(buildSources, ['build','jshint']);
});

gulp.task('copy-test-libs',['copy-libs'], function(){
	 gulp.src(libs)
		.pipe(gulp.dest('test/lib'));
	return gulp.src(testSources)
		.pipe(gulp.dest('test/lib'));
});

gulp.task('test',['copy-test-libs'], function(){
	return gulp.src(['test/test.js'])
		.pipe(mocha({require:[
            'jQuery',
            'knockout',
            'sammy'
        ]}))
		// Creating the reports after tests ran
		.pipe(istanbul.writeReports())
		// Enforce a coverage of at least 90%
		.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});


gulp.task('send-coverage',['test'], function(){
	return gulp.src('test/coverage/**/lcov.info')
		.pipe(coveralls());
});

gulp.task('copy-to-examples', function(){

});