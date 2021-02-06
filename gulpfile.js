const gulp = require("gulp");
const run = require("gulp-run");

const { watch, series } = gulp;

function generatePreviewImage(cb) {
  return run("node server.js").exec().pipe(gulp.dest("output"));
}

exports.default = function () {
  generatePreviewImage();
  watch("_posts/*.md", generatePreviewImage);
};
