"use script";

var gulp = require('gulp'),
    connect = require('gulp-connect'), // Runs a local dev server
    open = require('gulp-open'); // Open a URL in a web browser

var config = {
    port: 3000,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        dist: './dist'
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

// watch for any changes in html files
gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
})

gulp.task('default', ['html', 'open', 'watch']);
