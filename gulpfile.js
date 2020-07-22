const {src, dest} = require('gulp');
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const file_include = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const group_media = require('gulp-group-css-media-queries');
const clean_css = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const image_min = require('gulp-imagemin');
const webp = require('gulp-webp');
const webp_html = require('gulp-webp-html');
const webp_css = require('gulp-webpcss');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const gulp_zip = require('gulp-zip');
const gulp_util = require('gulp-util');
const ftp = require('vinyl-ftp');

let project_folder = "build";
let source_folder = "src";
let project_name = require('path').basename(__dirname);

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        font: project_folder + "/font/",
    },
    src: {
        html: [source_folder + "/**/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/**/*.scss",
        js: [source_folder + "/js/**/*.js", "!" + source_folder + "/js/**/*.min.js"],
        minJs: source_folder + "/js/**/*.min.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        font: source_folder + "/font/**/*.ttf",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + project_folder + "/"
}

const browserSync = () => {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        browser: "firefox",
        port: 3000,
        notify: false
    })
}

const html = () => {
    return src(path.src.html)
        .pipe(file_include())
        .pipe(webp_html())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

const css = () => {
    return src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(scss({
            outputStyle: "expanded",
            errorLogToConsole: true
        }))
        .on('error', console.error.bind(console))
        .pipe(group_media())
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: true
        }))
        .pipe(webp_css())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(rename({
            extname: ".min.css"
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

const loadLibsCss = () => {
    return gulp.src([
        'node_modules/flickity/css/flickity.css'
    ])
        .pipe(rename((path) => {
            return {
                dirname: path.dirname,
                basename: "_" + path.basename,
                extname: ".scss"
            };
        }))
        .pipe(dest(source_folder + "/scss/libs/"))
        .pipe(browsersync.stream());
}

const js = () => {
    src(path.src.js)
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
    return src(path.src.minJs)
        .pipe(dest(path.build.js));
}

const loadLibsJs = () => {
    return gulp.src([
        'node_modules/flickity/dist/flickity.pkgd.min.js',
        'node_modules/fslightbox/index.js'
    ])
        .pipe(rename((path, file) => {
            let filePathName = file.history[0];
            let fileNameIndex = filePathName.indexOf('/node_modules/') + 14;
            let fileNameLastIndex = filePathName.indexOf('/', fileNameIndex);
            let resultFileName = filePathName.substr(fileNameIndex, fileNameLastIndex - fileNameIndex);
            return {
                dirname: path.dirname,
                basename: resultFileName,
                extname: '.min.js'
            };
        }))
        .pipe(dest(source_folder + "/js/libs/"))
        .pipe(browsersync.stream());
}

const images = () => {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(image_min({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3 // 0 to 7
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

const fonts = () => {
    src(path.src.font)
        .pipe(ttf2woff())
        .pipe(dest(path.build.font));
    return src(path.src.font)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.font));
}

const fontsStyle = (params) => {
    const filePath = source_folder + '/scss/settings/_font-face.scss';
    let fileContent = fs.readFileSync(filePath);
    const cb = () => {
    };
    if (!fileContent.toString()) {
        fs.writeFile(filePath, '', cb);
        return fs.readdir(path.build.font, function (err, items) {
            if (items) {
                let cFontName;
                for (let i = 0; i < items.length; i++) {
                    let fontName = items[i].split('.');
                    fontName = fontName[0];
                    if (cFontName !== fontName) {
                        fs.appendFile(filePath, '@include font("' + fontName + '", "' + fontName + '", "400", "normal");\r\n', cb);
                    }
                    cFontName = fontName;
                }
            }
        });
    }
}

const zip = (params) => {
    return gulp.src(project_folder + "/**/*")
        .pipe(gulp_zip(project_name + '.zip'))
        .pipe(gulp.dest('.'));
}

const watchFiles = (params) => {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

const clean = (params) => {
    return del(path.clean);
}

const deploy = () => {
    let conn = ftp.create({
        host: 'files.000webhost.com',
        user: 'kuzma-vlad',
        password: '123root@',
        parallel: 10,
        log: gulp_util.log
    });

    let globs = [project_folder + '/**'];

    return src(globs, {buffer: false})
        .pipe(conn.dest('/public_html/gulp'));
}

let firstCompile = gulp.series(loadLibsCss, loadLibsJs);
let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.deploy = gulp.series(build, deploy);
exports.zip = gulp.series(build, zip);
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.loadLibsJs = loadLibsJs;
exports.js = js;
exports.loadLibsCss = loadLibsCss;
exports.css = css;
exports.html = html;
exports.build = build;
exports.firstCompile = firstCompile;
exports.watch = watch;
exports.default = watch;