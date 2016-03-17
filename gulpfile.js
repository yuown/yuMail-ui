var gulp = require('gulp');
var cssimport = require("gulp-cssimport");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');

var cssImportOptions = {};

gulp.task('clean', function () {
	return gulp.src('dist/*')
		.pipe(clean({force: true}))
		.pipe(gulp.dest('dist'));
});

var finalCssName = './src/css/yuMail.css';
var finalJsName = 'all.js';
var jsDistDir = './dist/js/';
var cssDistDir = './dist/css/';

gulp.task('browserify', function() {
    return browserify({entries: ['./src/js/yuMailApp.js', 
                                 './src/js/httpProvider.js', 
                                 './src/js/primary.js', 
                                 './src/js/routeSegmentProvider.js', 
                                 './src/js/services.js', 
                                 './src/js/stateProvider.js', 
                                 './src/js/home/controllers.js',
                                 './src/js/contacts/controllers.js',
                                 './src/js/groups/controllers.js',
                                 './src/js/settings/controllers.js' ]})
        .bundle()
        .pipe(source(finalJsName))
        .pipe(gulp.dest(jsDistDir));
});

gulp.task('copyangularcss', function(){
	return gulp.src('./node_modules/angular-material/angular-material.min.css')
			   .pipe(gulp.dest(cssDistDir));
});

gulp.task('processcss', function(){
	return gulp.src(finalCssName)
			   .pipe(cssimport(cssImportOptions))
			   .pipe(gulp.dest(cssDistDir));
});

gulp.task('copyfonts', function(){
	return gulp.src('./src/css/MaterialIcons-Regular.*')
			   .pipe(gulp.dest(cssDistDir));
});

gulp.task('copytmpls', function(){
    return gulp.src('./src/templates/**')
               .pipe(gulp.dest(jsDistDir));
});

gulp.task('default', ['clean'], function() {
	gulp.start(['copyangularcss', 'processcss', 'copyfonts', 'copytmpls', 'browserify']);
});
