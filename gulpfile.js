const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass")); // Компиляция SCSS
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify"); // Минификация JavaScript
const babel = require("gulp-babel"); // Транспиляция ES6+ в ES5

async function getDel() {
  const { deleteAsync } = await import("del");
  return deleteAsync;
}

async function getImagemin() {
  const imageminModule = await import("gulp-imagemin");
  const { default: imagemin, mozjpeg, optipng } = imageminModule;
  return { imagemin, mozjpeg, optipng };
}

gulp.task("clean", async function () {
  const del = await getDel();
  return del(["dist/**", "!dist"]);
});

gulp.task("html", function () {
  return gulp
    .src(["src/**/*.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(
      htmlmin({
        // Минимизация HTML
        collapseWhitespace: true, // Убирает лишние пробелы
        removeComments: true, // Удаляет комментарии
        removeEmptyAttributes: true, // Удаляет пустые атрибуты
        minifyJS: true, // Минимизирует JS внутри HTML
        minifyCSS: true, // Минимизирует CSS внутри HTML
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
});

gulp.task("images", async function () {
  const { imagemin, mozjpeg, optipng } = await getImagemin();
  return gulp
    .src("src/img/**/*.{png,jpg,jpeg,svg}", { encoding: false })
    .pipe(
      imagemin([
        optipng({ optimizationLevel: 5 }),
        mozjpeg({
          progressive: true,
          quality: 80,
        }),
      ])
    )
    .pipe(
      gulp.dest(function (file) {
        // Сохраняем структуру папок
        return file.base.replace("src", "dist");
      })
    )
    .pipe(browserSync.stream());
});

gulp.task("styles", function () {
  const plugins = [autoprefixer(), cssnano()];
  return gulp
    .src("src/scss/main.{scss,sass}") // Путь к вашим SCSS файлам
    .pipe(sass().on("error", sass.logError)) // Компиляция SCSS в CSS
    .pipe(
      postcss(plugins) // Добавление префиксов и минимизация
    )
    .pipe(gulp.dest("dist/css")) // Папка назначения для скомпилированных и обработанных стилей
    .pipe(browserSync.stream());
});

gulp.task("scripts", function () {
  return gulp
    .src("src/js/**/*.js") // Путь к вашим JS файлам
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    ) // Транспиляция ES6+ в ES5
    .pipe(uglify()) // Минификация JS
    .pipe(gulp.dest("dist/js")) // Папка назначения для обработанных и минифицированных JS файлов
    .pipe(browserSync.stream());
});

gulp.task("serve", function () {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });

  gulp.watch(["src/**/*.html"], gulp.series("html"));
  gulp.watch(["src/**/*.scss"], gulp.series("styles")); // Наблюдаем за изменениями в SCSS
  gulp.watch(["src/js/**/*.js"], gulp.series("scripts")); // Наблюдаем за изменениями в JS
  gulp.watch(["src/img/**/*.{png,jpg,jpeg,svg}"], gulp.series("clean", "images"));
});

gulp.task("default", gulp.series("clean", "images", "html", "styles", "scripts", "serve"));
gulp.task("build", gulp.series("clean", gulp.parallel("images", "html", "styles", "scripts")));
