var gulp = require('gulp')
var cssimport = require("gulp-cssimport")

var browserify = require('browserify')
var source = require('vinyl-source-stream')

var clean = require('gulp-clean');

var cssImportOptions = {};

gulp.task('clean', function () {
	return gulp.src('dist/*')
		.pipe(clean({force: true}))
		.pipe(gulp.dest('dist'));
});

gulp.task('browserify', function() {
    return browserify({entries: ['./src/js/yuMailApp.js', 
                                 './src/js/httpProvider.js', 
                                 './src/js/primary.js', 
                                 './src/js/routeSegmentProvider.js', 
                                 './src/js/services.js', 
                                 './src/js/stateProvider.js', 
                                 './src/js/home/controllers.js',
                                 './src/js/settings/controllers.js' ]})
        .bundle()
        .pipe(source('all.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('copyangularcss', function(){
	return gulp.src('./node_modules/angular-material/angular-material.min.css')
			   .pipe(gulp.dest('./dist/css/'));
});

gulp.task('processcss', function(){
	return gulp.src('./src/css/yuMail.css')
			   .pipe(cssimport(cssImportOptions))
			   .pipe(gulp.dest('./dist/css/'));
});

gulp.task('copyfonts', function(){
	return gulp.src('./src/css/MaterialIcons-Regular.*')
			   .pipe(gulp.dest('./dist/css/'));
});

gulp.task('copytmpls', function(){
    return gulp.src('./src/templates/**')
               .pipe(gulp.dest('./dist/js/'));
});

gulp.task('default', ['clean'], function() {
	gulp.start(['copyangularcss', 'processcss', 'copyfonts', 'copytmpls', 'browserify']);
});
