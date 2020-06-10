// Defining settings
var settings = {
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
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');



// Run: 
// gulp clean-js
// Delete existing generated js files
gulp.task( 'clean-js', function( done ) {
	del.sync( [ './dist/*.js', './dist/maps/*.map' ] );
	done();
} );



// Run: 
// gulp build-js. 
// Uglifies and concat all JS files into one
gulp.task( 'build-js', gulp.series( 'clean-js', function( done ) {
	gulp.src([
		settings.nodePath + 'loadjs/dist/loadjs.js',
		settings.jsPath + 'require-bundle.js',
	])
	.pipe(sourcemaps.init())
	.pipe(concat('require-bundle.js'))
	.pipe(gulp.dest('./dist/')) // save .js
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest('./dist/')); // save .min.js

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
