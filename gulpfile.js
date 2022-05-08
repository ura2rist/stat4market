const { src, dest, series, watch } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const image = require('gulp-image');
const uglify = require('gulp-uglify-es').default;
const path = {
	src: {
		css: 'src/style/*.css',
		resourcesCss: 'src/style/resources/**',
		html: 'src/*.html',
		svg: 'src/images/svg/**/*.svg',
		img: [
			'src/images/**/*.{jpg,jpeg,png}',
			'src/images/*.svg',
		],
		js: [
				'src/script/components/**/*.js',
				'src/script/main.js',
		],
		fonts: 'src/fonts/**',
		resources: 'src/resources/**',
	},
	result: {
		css: 'result/style/',
		html: 'result/',
		img: 'result/images/',
		js: 'result/script/',
		fonts: 'result/fonts/',
	}
};

const html = () => {
	return src(path.src.html)
		.pipe(dest(path.result.html))
		.pipe(browserSync.stream())
};

const resources = () => {
	return src(path.src.resources)
		.pipe(dest(path.result.js))
}

const styles = () => {
	src(path.src.resourcesCss)
		.pipe(cleanCss({
			level: 2,
		}))
		.pipe(sourcemaps.write())
		.pipe(dest(path.result.css))

	return src(path.src.css)
		.pipe(sourcemaps.init())
//		.pipe(concat('style.css'))
		.pipe(autoprefixer({
			cascade: true,
		}))
		.pipe(cleanCss({
			level: 2,
		}))
		.pipe(sourcemaps.write())
    .pipe(dest(path.result.css))
    .pipe(browserSync.stream())
}

const svgSprites = () => {
	return src(path.src.svg)
		.pipe(svgSprite({
			mode: {
			  stack: {
				sprite: '../sprite.svg',
			  }
			}
		}))
		.pipe(dest(path.result.img))
    .pipe(browserSync.stream())
}

const fonts = () => {
	return src(path.src.fonts)
		.pipe(dest(path.result.fonts))
}

const scripts = () => {
	return src(path.src.js)
	  .pipe(sourcemaps.init())
	  .pipe(babel({
		presets: ['@babel/env']
	  }))
	  .pipe(concat('app.js'))
	  .pipe(uglify({
		toplevel: true,
	  }).on('error', notify.onError()))
	  .pipe(sourcemaps.write())
	  .pipe(dest(path.result.js))
	  .pipe(browserSync.stream())
}
  
const images = () => {
	return src(path.src.img)
	  .pipe(image())
	  .pipe(dest(path.result.img))
	  .pipe(browserSync.stream())
}
  

const clean = () => {
    return del(['result']);
};

const watchFile = () => {
	browserSync.init({
		server: {
			baseDir: path.result.html,
		}
	})
};

watch(path.src.html, html);
watch(path.src.css, styles);
watch(path.src.svg, svgSprites);
watch(path.src.js, scripts);
watch(path.src.img, images);
watch(path.src.fonts, fonts);

exports.default = series(clean, html, resources, svgSprites, images, fonts, scripts, styles, watchFile);