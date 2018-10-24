const argv = require("yargs").argv;
const browserSync = require("browser-sync");
const browserify = require("browserify");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const reload = browserSync.reload;
const sass = require("gulp-sass");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");

const paths = {
  "bar": "visualize_data_with_a_bar_chart",
  "scatter": "visualize_data_with_a_scatterplot_graph"
};

// development tools

gulp.task("browserify", function() {
  return browserify(paths[argv.p] + "/js/src/main.js")
  .transform("babelify", {presets: ["@babel/preset-env"]})
  .bundle()
  .pipe(source("main.js"))
  .pipe(gulp.dest(paths[argv.p] + "/js/build"))
  .pipe(browserSync.stream());
});

gulp.task("eslint", function() {
  return gulp.src(paths[argv.p] + "/js/src/main.js")
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .on("error", onError);
});

gulp.task("sass", function() {
  return gulp.src(paths[argv.p] + "/scss/main.scss")
  .pipe(plumber({errorHandler: onError}))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths[argv.p] + "/css"))
  .pipe(reload({stream: true}));
});

gulp.task("default", gulp.series(checkArguments, "sass", "eslint", "browserify",
function startServer() {
  browserSync({
    server: paths[argv.p]
  });

  gulp.watch([paths[argv.p] + "/index.html"], reloadHtml);
  gulp.watch([paths[argv.p] + "/js/src/*.js"], gulp.parallel("eslint", "browserify"));
  gulp.watch([paths[argv.p] + "/scss/*.scss"], gulp.series("sass"));
}));

// helper functions

function checkArguments(done) {
  if (!argv.p) {
    throw new Error("Error: Missing option \"p\"");
  }
  if (!paths.hasOwnProperty(argv.p)) {
    throw new Error("Error: Option not found");
  }
  done();
}

function onError(err) {
  notify.onError({
    title: "Gulp error in " + err.plugin,
    message: err.toString()
  })(err);
  this.emit("end");
}

function reloadHtml(done) {
  reload();
  done();
}
