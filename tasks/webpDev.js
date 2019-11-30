import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';

export function gulpWebpDev(src = []) {
   return gulp.src(src)
   .pipe(imagemin([
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
   ]))
   .pipe(webp({
      quality: 80
   }))
	.pipe(gulp.dest('tmp/images'));
}
