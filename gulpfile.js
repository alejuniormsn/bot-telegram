const gulp = require("gulp");
const uglify = require("gulp-uglify");
const rimraf = require("gulp-rimraf");

gulp.task("clean", () => {
  return gulp
    .src("build", { allowEmpty: true }) // permitir exclusão mesmo se pasta estiver vazia
    .pipe(rimraf());
});

gulp.task("minifying", () => {
  return gulp
    .src(["**/*.*", "!node_modules/**/*.*", "!package*.json"])
    .pipe(uglify())
    .pipe(gulp.dest("build"));
});

gulp.task("copy", () => {
  return gulp
    .src([".env", "package-lock.json", "package.json"])
    .pipe(gulp.dest("build"));
});

gulp.task("build", gulp.series("clean", "minifying", "copy"));
