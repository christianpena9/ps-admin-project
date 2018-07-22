"use script";

var gulp = require('gulp'),
    connect = require('gulp-connect'), // Runs a local dev server
    open = require('gulp-open'), // Open a URL in a web browser
    browserify = require('browserify'), // Bundles js
    reactify = require('reactify'), // Transform react jsx to js
    source = require('vinyl-source-stream'), // Use conventional text streams with gulp
    concat = require('gulp-concat'); // Concatenates files

var config = {
    port: 3000,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        mainJs: './src/main.js'
    }
}

// Start a local development server
gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

// opening the project on the localhost website
gulp.task('open', ['connect'], function() {
    gulp.src('dist/index.html')
    .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }))
});

// Take the html files inside src and move it to dist folder
gulp.task('html', function() {
    gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

/*
    JS Task to take js file and pass it through browserify, then convert js into react which we will then bundle,
    check if there is any error, move it over to bundle.js file, move the file over to scrips and then refresh the page
*/
gulp.task('js', function() {
    browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
});


/* CSS Task to take bootstrap files, concat it with bundles.css and then move the file to css folder */
gulp.task('css', function() {
    gulp.src(config.paths.css)
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(config.paths.dist + '/css'));
});

// watch for any changes in html files
gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
})

gulp.task('default', ['html', 'js', 'css', 'open', 'watch']);
