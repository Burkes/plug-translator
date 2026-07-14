const del = require("del");
const gulp = require("gulp");
const package = require("./package");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const runseq = require("run-sequence");
const template = require("gulp-template");

const fs = require("graceful-fs");

gulp.task("clean", () => {
	del(["dist/*"]).then(
		() => fs.mkdir("dist", err => {
			if (err && err.code !== "EEXIST")
				console.error(err);
		}),
		err => console.error(err)
	);
});

gulp.task("minify", () => {
	return gulp.src(`src/${package.name}.js`)
		.pipe(babel({
			presets: ["es2015"]
		}))
		.pipe(uglify().on("error", console.log))
		.pipe(rename(`${package.name}.min.js`))
		.pipe(gulp.dest("dist"));
});

gulp.task("userscript", () => {
	return gulp.src([`src/${package.name}.meta.js`, `src/${package.name}.user.js`])
		.pipe(concat(`${package.name}.user.js`))
		.pipe(template(package))
		.pipe(gulp.dest("dist"));
});

gulp.task("build", runseq("clean", "minify", "userscript"));