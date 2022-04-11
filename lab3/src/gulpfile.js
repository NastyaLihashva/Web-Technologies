const gulp = require("gulp");
// const watcher = require("gulp-watch");
const less = require('gulp-less');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pug = require('gulp-pug');
const del = require("del");
const cleanStyles = ()=>del(["server/public/styles"]);
const clean = ()=>del(["server/public"]);

const distDir = "server/public/";
const srcDir = "server/src/";

function copyImg(){
    return gulp.src(srcDir + "/img/**/*.*")
        .pipe(gulp.dest(distDir + "/img"));
}

function styles() {
    return gulp.src(srcDir + '/styles/*.less')
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(distDir + 'styles/'));
}

function js(){
    return gulp.src(srcDir + '/script/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(distDir + 'script/'))
}

function pugComp(){
    return gulp.src(srcDir + '/*.pug')
        .pipe(pug({

        }))
        .pipe(gulp.dest(distDir))
}


gulp.task("html", pugComp);
gulp.task("script", js);
gulp.task("css", styles);

gulp.task('watch', function () {
    gulp.watch(`${srcDir}styles/*.less`, gulp.series('css'));
    gulp.watch(`${srcDir}*.pug`, gulp.series('html'));
    gulp.watch(`${srcDir}script/*.js`, gulp.series('script'));
    gulp.watch(`${srcDir}/img`, copyImg);
});

gulp.task("default", gulp.series(clean, copyImg, pugComp, styles, js, 'watch'));
gulp.task("clean", clean);