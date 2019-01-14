const handel = require('./handle')
const colors = require('colors')
const path = require('path')
const emoji = require('node-emoji')
module.exports = async function(argv,cb= ()=>{}) {
  argv.file = argv.file.toString()
  const existPathFolder = await handel.existFolder(path.resolve(argv.path))
  const fileName = argv.file
    // argv.file.substring(0, 1).toUpperCase() + argv.file.substring(1)
  let className = ''

  for (let i = 0; i < argv.file.length; i++) {
    if (/[A-Z]/.test(argv.file[i])) {
      className += '-'
    }
    className += argv.file[i].toLowerCase()
  }
  if (argv.path !== '') {
    argv.path += '/'
  }
  const filePath = path.resolve(argv.path) + '/' + fileName
  process.stdin.setEncoding('utf8')

  const createFileData = {
    filePath,
    fileName,
    className,
    templatePath: argv.templatePath
  }

  // 判断组件文件夹是否存在
  const existFileFolder = await handel.existFolder(filePath)

  if (existFileFolder) {
    console.warn(colors.green(`${fileName}文件夹已存在`))
    return true
  } else {
    // 创建组件文件夹
    await handel.createFolder(filePath)

    // 创建文件
    await handel.createFile(createFileData)
    cb()
    process.exit()

  }
}
