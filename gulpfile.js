// Defining settings
var settings = {
	pkg: {},
	assetsVersion: '',
	nodePath: './node_modules/',
	jsPath: './js-src/'
};
// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var loadJsonFile = require('load-json-file');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');


// Run: 
// gulp get-ver
// Starts watcher. Watcher runs appropriate tasks on file changes
gulp.task( 'get-ver', function( done ) {
	var json = loadJsonFile.sync( 'package.json' );
	settings.pkg = json;
	settings.assetsVersion = '-' + json.version.replace( /\./gi, '' );

	done();
});



// Run: 
// gulp clean-js
// Delete existing generated js files
gulp.task( 'clean-js', function( done ) {
	del.sync( [ './js/*.js', './js/maps/*.map' ] );
	done();
} );



// Run: 
// gulp build-js. 
// Uglifies and concat all JS files into one
gulp.task( 'build-js', gulp.series( 'get-ver', 'clean-js', function( done ) {

	// PLUGIN FILES
	gulp.src([
    settings.nodePath + 'loadjs/dist/loadjs.js',
		settings.jsPath + 'require-bundle.js',
	])
  .pipe(sourcemaps.init())
  .pipe(concat('require-bundle.js'))
  .pipe(gulp.dest('./js/')) // save .js
  .pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('./js/')); // save .min.js

	done();
} ) );



// Run: 
// gulp watch
// Starts watcher. Watcher runs appropriate tasks on file changes
gulp.task( 'watch', function ( done ) {
	gulp.watch('./js-src/**/*.js', gulp.series( 'build-js' ) );
	gulp.watch('./package.json', gulp.series( 'build' ) );

	done();
} );



// Run: 
// gulp build
// Build css and js assets
gulp.task( 'build', gulp.series( 'build-js' ) );



// Run: 
// gulp
// Defines gulp default task
gulp.task( 'default', gulp.series( 'watch' ) );
