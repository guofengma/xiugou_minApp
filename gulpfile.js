const gulp = require('gulp');
const less = require('gulp-less');
const minimist = require('minimist');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const fs = require('fs')
const path = require('path');
const replace = require('gulp-replace');
const watch = require('gulp-watch');
const node_env = process.argv.slice(2)[0]
const domainImgUrl = '${mrdomain}/'

const srcPath = './min_xiugou/**';
const distPath = './dist/';
//读入config.json文件
const myConfig = require('./config.json');
//读入app.json文件
const appJson = require('./app.json');
const wxmlFiles = [`${srcPath}/*.wxml`, `!${srcPath}/_template/*.wxml`];
const lessFiles = [
    `${srcPath}/*.less`,
    `!${srcPath}/styles/**/*.less`,
    `!${srcPath}/_template/*.less`
];
const wxssFiles = [
    `${srcPath}/*.wxss`,
    `!${srcPath}/styles/**/*.wxss`,
    `!${srcPath}/_template/*.wxss`
];
const jsonFiles = [`${srcPath}/*.json`, `!${srcPath}/_template/*.json`];
const jsFiles = [`${srcPath}/*.js`, `!${srcPath}/_template/*.js`];
const imgFiles = [
    `${srcPath}/img/*.{png,jpg,gif,ico}`,
    `${srcPath}/img/**/*.{png,jpg,gif,ico}`
];
//默认dev环境
let knowOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'dev'
    }
};

/* 清除dist目录 */
gulp.task('clean', done => {
    del.sync(['dist/**/*']);
    done();
});

let options = minimist(process.argv.slice(2), knowOptions);

//生成filename文件，存入string内容
const string_src = (filename, string)=> {
    let src = require('stream').Readable({objectMode: true})
    src._read = function () {
        this.push(new gutil.File({cwd: "", base: "", path: filename, contents: Buffer.from(string)}))
        this.push(null)
    }
    return src
}
/* 生成config.js文件 */
const constants = ()=> {
    //取出对应的配置信息
    let envConfig = myConfig[node_env];
    let name = options.env || 'dev'
    let obj = {
        ...envConfig,
        ...myConfig['base'],
        // 如果是开发环境的指向联调人员的ip地址 否则指向环境内的baseUrl
        baseUrl: node_env == 'dev' ? myConfig['devBaseUrl'][name] : envConfig['baseUrl']
    }
    let conConfig = 'const config=' + JSON.stringify(obj, null, "\t") + '; export default config';
    //生成config.js文件
    return string_src("config.js", conConfig)
        .pipe(gulp.dest(distPath))
}

gulp.task(constants);

//生成app.json
const app = done => {

    //生成config.js文件
    return string_src("app.json", JSON.stringify(appJson, null, "\t") + '')
        .pipe(gulp.dest(distPath))

}

gulp.task(app);


/* 编译wxml文件 */
const wxml = () => {
    return gulp
        .src(wxmlFiles, {since: gulp.lastRun(wxml)})
        .pipe(replace(domainImgUrl, myConfig[node_env]['imgBaseUrl']))
        .pipe(gulp.dest(distPath));
};
gulp.task(wxml);

/* 编译JS文件 */
const js = () => {
    return gulp
        .src(jsFiles, {since: gulp.lastRun(js)})
        .pipe(gulp.dest(distPath));
};
gulp.task(js);

/* 编译json文件 */
const json = () => {
    return gulp
        .src(jsonFiles, {since: gulp.lastRun(json)})
        .pipe(gulp.dest(distPath));
};
gulp.task(json);

/* 编译wxss文件 */
const wxss = () => {
    return gulp
        .src(wxssFiles, {since: gulp.lastRun(wxss)})
        .pipe(replace(domainImgUrl, myConfig[node_env]['imgBaseUrl']))
        .pipe(gulp.dest(distPath));
};
gulp.task(wxss);

/* 编译less文件 */
const lessFile = () => {
    return gulp
        .src(lessFiles, {since: gulp.lastRun(lessFile)})
        .pipe(less())
        .pipe(rename({extname: '.wxss'}))
        .pipe(replace(domainImgUrl, myConfig[node_env]['imgBaseUrl']))
        .pipe(gulp.dest(distPath));
};
gulp.task(lessFile);

/* 编译压缩图片 */
const img = () => {
    return gulp
        .src(imgFiles, {since: gulp.lastRun(img)})
        .pipe(imagemin())
        .pipe(gulp.dest(distPath));
};
gulp.task(img);


/* watch */
gulp.task('watch', () => {
    let watchWxssFiles = [...wxssFiles]
    let watchLessFiles = [...lessFiles]
    watchLessFiles.pop();
    gulp.watch(watchWxssFiles, wxss);
    gulp.watch(watchLessFiles, lessFile);
    gulp.watch(jsFiles, js);
    gulp.watch(imgFiles, img);
    gulp.watch(jsonFiles, json);
    gulp.watch(wxmlFiles, wxml);
    // gulp.watch( watchMyConfigJson, constants);
});

/* build */
gulp.task(
    'build',
    gulp.series('clean', gulp.parallel('app','constants',  'wxml', 'js', 'json', 'wxss', 'lessFile', 'img'))
);
/* dev 紧开发模式下面监听代码变化并更新dist的文件 */
gulp.task('dev', gulp.series('build', 'watch'));

/* test */
gulp.task('test', gulp.series('build'));

/* prod */
gulp.task('prod', gulp.series('build'));


/**
 * add 自动创建page or template or component
 * @example gulp add
 */
const add = done => {
    return new Promise(function (resolve, reject) {
        const handel = require('./addFile/handle')
        const start = require('./addFile/start')
        const inquirer = require('./addFile/inquirer')
        require('./addFile/select')
        ;
        (async() => {
            // 控制台交互
            const data = await inquirer({
                placementPath: '.'
            })
            const argv = {
                file: data.file,
                path: data.placementPath,
                templatePath: data.templatePath,
                pathName: data.pathName,
                isPage: data.isPage,
            }
            // 如果是page页面 那么就直接在app.json 中写入数据
            if (argv.isPage) {
                if(!appJson.pages.includes(argv.pathName)) appJson.pages.push(argv.pathName)
                string_src("app.json", JSON.stringify(appJson, null, "\t")).pipe(gulp.dest('./'))
            }

            // 根据参数，创建模板
            start(argv)

        })()
        resolve();
    });

};
gulp.task(add);
