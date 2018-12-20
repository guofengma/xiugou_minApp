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
//读入config.json文件
const myConfig = require('./config.json');
const srcPath = './min_xiugou/**';
const distPath = './dist/';
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
    env: process.env.NODE_ENV|| 'dev'
  }
};

/* 清除dist目录 */
gulp.task('clean', done => {
  del.sync(['dist/**/*']);
  done();
});

let options = minimist(process.argv.slice(2), knowOptions);

//生成filename文件，存入string内容
const string_src=(filename, string)=> {
  var src = require('stream').Readable({ objectMode: true })
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: Buffer.from(string)}))
    this.push(null)
  }
  return src
}
/* 生成config.js文件 */
const constants = ()=>{
  //取出对应的配置信息
  let envConfig = myConfig[node_env];
  // let envName = myConfig[options.env]
  let obj = {
    ...envConfig,
    ...myConfig['base'],
    // 如果是开发环境的指向联调人员的ip地址 否则指向环境内的baseUrl
    baseUrl:node_env=='dev'? myConfig['devBaseUrl'][options.env]:envConfig['baseUrl']
  }
  let conConfig = 'const config=' + JSON.stringify(obj) + '; export default config';
  //生成config.js文件
  return string_src("config.js", conConfig)
      .pipe(gulp.dest(distPath))
}

gulp.task(constants);


/* 编译wxml文件 */
const wxml = () => {
  return gulp
    .src(wxmlFiles, { since: gulp.lastRun(wxml)})
    .pipe(replace(domainImgUrl, myConfig[node_env]['imgBaseUrl']))
    .pipe(gulp.dest(distPath));
};
gulp.task(wxml);

/* 编译JS文件 */
const js = () => {
  return gulp
    .src(jsFiles, { since: gulp.lastRun(js) })
    .pipe(gulp.dest(distPath));
};
gulp.task(js);

/* 编译json文件 */
const json = () => {
  return gulp
    .src(jsonFiles, { since: gulp.lastRun(json) })
    .pipe(gulp.dest(distPath));
};
gulp.task(json);

/* 编译wxss文件 */
const wxss = () => {
  return gulp
    .src(wxssFiles, { since: gulp.lastRun(wxss)})
    .pipe(replace(domainImgUrl, myConfig[node_env]['imgBaseUrl']))
    .pipe(gulp.dest(distPath));
};
gulp.task(wxss);

/* 编译less文件 */
const lessFile = () => {
  return gulp
      .src(lessFiles, { since: gulp.lastRun(lessFile)})
      .pipe(less())
      .pipe(rename({ extname: '.wxss' }))
      .pipe(replace(domainImgUrl, myConfig[node_env]['imgBaseUrl']))
      .pipe(gulp.dest(distPath));
};
gulp.task(lessFile);

/* 编译压缩图片 */
const img = () => {
  return gulp
    .src(imgFiles, { since: gulp.lastRun(img)})
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
    gulp.series('clean', gulp.parallel('constants','wxml', 'js', 'json', 'wxss','lessFile','img'))
);
/* dev */
gulp.task('dev', gulp.series('build', 'watch'));

/* test */
gulp.task('test', gulp.series('build', 'watch'));

/* prod */
gulp.task('prod', gulp.series('build', 'watch'));


const existFolder = async (path)=> {
  // 判断是否存在argv.path的文件夹
  return new Promise(function(resolve, reject) {
    return fs.exists(path, e => {
      resolve(e)
    })
  })
}
/**
 * auto 自动创建page or template or component
 *  -s 源目录（默认为_template)
 * @example
 *   gulp auto -p mypage           创建名称为mypage的page文件
 *   gulp auto -t mytpl            创建名称为mytpl的template文件
 *   gulp auto -c mycomponent      创建名称为mycomponent的component文件
 *   gulp auto -s index -p mypage  创建名称为mypage的page文件
 */
const auto = done => {
  const yargs = require('yargs')
      .option({
        s: {
          alias: 'src',
          default: '_template',
          describe: 'copy的模板',
          type: 'string'
        },
        p: {
          alias: 'page',
          describe: '生成的page名称',
          conflicts: ['t', 'c'],
          type: 'string'
        },
        t: {
          alias: 'template',
          describe: '生成的template名称',
          type: 'string',
          conflicts: ['c']
        },
        c: {
          alias: 'component',
          describe: '生成的component名称',
          type: 'string'
        },
        version: { hidden: true },
        help: { hidden: true }
      })
      .fail(msg => {
        done();
        console.error('创建失败!!!');
        console.error(msg);
        console.error('请按照如下命令执行...');
        yargs.parse(['--msg']);
        return;
      })
      .help('msg');

  const argv = yargs.argv;
  const source = argv.s;
  console.log(argv,source)
  const typeEnum = {
    p: 'pages',
    t: 'templates',
    c: 'components'
  };
  let hasParams = false;
  let name, type;
  for (let key in typeEnum) {
    hasParams = hasParams || !!argv[key];
    if (argv[key]) {
      name = argv[key];
      type = typeEnum[key];
    }
  }
  if (!hasParams) {
    done();
    yargs.parse(['--msg']);
  }

  const root = path.join(__dirname, 'src', type);
  return gulp
      .src(path.join(root, source, '*.*'))
      .pipe(
          rename({
            dirname: name,
            basename: name
          })
      )
      .pipe(gulp.dest(path.join(root)));
};
gulp.task(auto);
