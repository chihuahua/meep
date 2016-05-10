/**
 * Gulp file for project meep.
 */

// Let gulp plugins (not application JS code) use ES6.
// The gulp-closure-compiler module uses ES6.
require('harmonize')();

var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');
var closureCssRenamer = require('gulp-closure-css-renamer');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var less = require('gulp-less');
var util = require('gulp-util');

gulp.task('default', function() {
  minifyHtml();
  // We must compile javascript after generating the CSS renaming map.
  compileCss().on('end', function() {
    compileMainEntryPoint();
    compileMp3WebWorkerEntryPoint();
  });
});

gulp.task('serve', function() {
  launchDevelopmentServer();
});

/**
 * Minifies HTML.
 * @return {!Object} The gulp result from minification.
 */
function minifyHtml() {
  return gulp.src('html/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
}

/**
 * Compiles JS for the main app entry point.
 * @return {!Object} The gulp result from compilation.
 */
function compileMainEntryPoint() {
  return compileJs('m.js', 'meep.entryPoints.main');
}

/**
 * Compiles JS for the web worker entry point (for encoding MP3s).
 * @return {!Object} The gulp result from compilation.
 */
function compileMp3WebWorkerEntryPoint() {
  return compileJs('mp3.js', 'meep.entryPoints.mp3Worker');
}

/**
 * Compiles JS.
 * @param {string} compiledFileName The name of the compiled file. Saved in
 *     build/js.
 * @param {string} entryPoint The entry point. Must be provided somewhere.
 * @return {!Object} The gulp result from compilation.
 */
function compileJs(compiledFileName, entryPoint) {
  // Compile and minify JS.
  gulp.src('js/**/*.js')
    .pipe(closureCompiler({
      compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
      // The name of the compiled JS.
      fileName: compiledFileName,
      compilerFlags: {
        // The entry point for JS to run.
        closure_entry_point: [
          'cssVocabulary',
          entryPoint,
        ],
        // Change the compilation level to WHITESPACE to simply concatenate all
        // JS files together instead of doing any minification. WHITESPACE is
        // useful for debugging. Debugging obfuscated JS is obvi harder.
        // compilation_level: 'ADVANCED_OPTIMIZATIONS',

        // Uncomment the above and use these 2 options for no compilation at
        // all. This is helpful for debugging.
        compilation_level: 'WHITESPACE_ONLY',
        formatting: 'PRETTY_PRINT',

        externs: ['third-party/closure-externs/**/*.js'],
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
 * Compiles CSS.
 */
function compileCss() {
  // Minify CSS and create a rename mapping to be used during JS compilation.
  return gulp.src('js/**/*.css')
    .pipe(less())
    .on('error', logError)
    .pipe(concat('c.css'))
    .pipe(closureCssRenamer({
      compress: true,
      renameFile: 'js/closure/rename-mapping.js'
    }))
    .on('error', logError)
    .pipe(gulp.dest('build/css'));
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
