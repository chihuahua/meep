/**
 * Gulp file for project meep.
 */

// Let gulp plugins (not application JS code) use ES6.
require('harmonize')();

var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');
var util = require('gulp-util');

gulp.task('default', function() {
	compileJs();
});

gulp.task('serve', function() {
  launchDevelopmentServer();
});

/**
 * Compiles JS.
 * @return {!Object} The gulp result from compilation.
 */
function compileJs() {
	// Compile and minify JS.
  gulp.src('js/**/*.js')
    .pipe(closureCompiler({
      compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
      // The name of the compiled JS.
      fileName: 'm.js',
      compilerFlags: {
      	// The entry point for JS to run.
        closure_entry_point: 'meep.entryPoints.main',
        // Change the compilation level to WHITESPACE to simply concatenate all
        // JS files together instead of doing any minification. WHITESPACE is
        // useful for debugging. Debugging obfuscated JS is obvi harder.
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        externs: [],
        // Do not include any un-needed JS in our app.
        only_closure_dependencies: true,
        warning_level: 'VERBOSE'
      }
    }))
    .on('error', logError)
    // Save compiled JS to the build directory.
    .pipe(gulp.dest('build/js'));
}

/**
 * Logs an error message to the console.
 * @param {!Object|string} err The error object or string.
 */
function logError(err) {
	util.log(util.colors.red(err));
}

/**
 * Launches a development server on port 3000 with build/ as the home directory.
 */
function launchDevelopmentServer() {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  });

  gulp.watch([
    'build/*',
  ], browserSync.reload);
}
