var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');                //自动兼容
var notify = require('gulp-notify');                            //出现异常提示
var plumber = require('gulp-plumber');                          //出现异常不终止Watch
var less = require('gulp-less');                                //-less css转换
var concat = require('gulp-concat');                            //- 多个文件合并为一个；
var cleanCss = require('gulp-clean-css');                       //- 压缩CSS为一行；
/*var rev = require('gulp-rev');                                //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');   */          //- 路径替换

gulp.task('concat', function() {                                //- 创建一个名为 concat 的 task
    gulp.src(['./css/reset.less', './css/index.less', './css/home.less', './css/city.less', './css/address.less', './css/detail.less'])      //- 需要处理的css文件，放到一个字符串数组里
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less())
        .pipe(concat('all.min.css'))                            //- 合并后的文件名
        .pipe(cleanCss({
            advanced: true,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        /*.pipe(rev()) */                                         //- 文件名加MD5后缀
        .pipe(gulp.dest('./css'))                                 //- 输出文件本地
        /*.pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev')); */                             //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('WatchCSS', function () {
    gulp.watch('./css/*.less', ['concat']); //当所有less文件发生改变时，调用testLess任务
});
/*gulp.task('default', ['concat']);*/ //执行default之前执行concat