var gulp = require('gulp');
var cssimport = require("gulp-cssimport");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

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
    var files1 = [
//                  './bower_components/textAngular/dist/textAngular-rangy.min.js',
//                  './bower_components/textAngular/dist/textAngular-sanitize.min.js',
//                  './bower_components/textAngular/dist/textAngular.js',
//                  './bower_components/textAngular/dist/textAngularSetup.js',
                  './src/js/yuMailApp.js', 
                  './src/js/httpProvider.js', 
                  './src/js/primary.js', 
                  './src/js/routeSegmentProvider.js', 
                  './src/js/services.js', 
                  './src/js/stateProvider.js', 
                  './src/js/home/controllers.js',
                  './src/js/contacts/controllers.js',
                  './src/js/groups/controllers.js',
                  './src/js/settings/controllers.js',
                  './src/js/templates/controllers.js'
                   ];
    return browserify({entries: files1})
        .bundle()
        .pipe(source(finalJsName))
        .pipe(gulp.dest(jsDistDir));
});

gulp.task('bower', function() {
    return bower().pipe(gulp.dest(jsDistDir));
});

gulp.task('copyangularcss', function(){
	return gulp.src('./node_modules/angular-material/angular-material.min.css')
			   .pipe(gulp.dest(cssDistDir));
});

gulp.task('copyquillcss', function(){
    return gulp.src('./src/css/quill.snow.css')
               .pipe(gulp.dest(cssDistDir));
});

gulp.task('copyquillcss1', function(){
    return gulp.src('./src/css/quill.base.css')
               .pipe(gulp.dest(cssDistDir));
});

gulp.task('copyquilljs', function(){
    return gulp.src('./src/js/quill.js')
               .pipe(gulp.dest(jsDistDir));
});

gulp.task('copyngquilljs', function(){
    return gulp.src('./src/js/ng-quill.min.js')
               .pipe(gulp.dest(jsDistDir));
});

gulp.task('copyjquery', function(){
    return gulp.src('./node_modules/jquery/dist/jquery.js')
               .pipe(gulp.dest(jsDistDir));
});

gulp.task('copyjqueryui', function(){
    return gulp.src('./src/js/jquery-ui.min.js')
               .pipe(gulp.dest(jsDistDir));
});

gulp.task('copyangular', function(){
    return gulp.src('./node_modules/angular/angular.js')
               .pipe(gulp.dest(jsDistDir));
});

gulp.task('copysortable', function(){
    return gulp.src('./node_modules/angular-ui-sortable/dist/sortable.js')
               .pipe(gulp.dest(jsDistDir));
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

gulp.task('default', [], function() {
	runSequence('clean', ['copyangularcss', 'copyquillcss', 'copyquillcss1', 'processcss', 'copyfonts', 'copytmpls', 'browserify', 'copyquilljs', 'copyngquilljs']);
});
