const fs = require('fs')
const colors = require('colors')
const path = require('path')
module.exports = {
  existFolder: async function(path) {
    // 判断是否存在argv.path的文件夹
    return new Promise(function(resolve, reject) {
      return fs.exists(path, e => {
        resolve(e)
      })
    })
  },
  /**
   *创建文件夹
   @param filePath 文件路径
   */
  createFolder: function(filePath) {
    return new Promise(function(resolve, reject) {
      fs.mkdir(filePath, function(err) {
        if (err) {
          if (err.errno === -2) {
            console.log(colors.red('找不到目录'))
          } else if (err.errno === -17) {
          }
        } else {
          console.log(colors.green('创建文件夹: '))
          console.log(colors.underline(`${filePath}`))
        }
        resolve()
      })
    })
  },
  /**
   * @param args:{
   *  filePath 文件路径
   *  fileName 文件名
   *  className 样式名
   *  templatePath 模板文件地址
   * }
   */
  createFile: function({ filePath, fileName, className, templatePath }) {
    const data = {
      fileName,
      filePath,
      className
    }
    // 模板路径
    data.templateFolderPath = path.join(__dirname, templatePath)
    return new Promise(async (resolve, reject) => {
      await this.readAndWiteFile(data, resolve)
    })
  },
  /**
   * 读取模板内容并且写到新建文件里面
   * @param args:{
   *  templateFolderPath 模板路径
   *  fileName 文件名
   *  filePath 文件路径
   *  className 样式名字
   * }
   * @param resolve
   */
  readAndWiteFile: function(
    { templateFolderPath, fileName, filePath, className },
    resolve
  ) {
    fs.readdir(templateFolderPath, 'utf8', (err, files) => {
      if (err) {
        console.log(colors.red(err))
        return false
      }
      files.forEach(templateName => {
        const FileName = templateName
          .replace('TemplateName', fileName)
        // 1.创建文件
        fs.createWriteStream(`${filePath}/${FileName}`)
        // 2.读取、写入模板内容
        const content = fs
          .readFileSync(`${templateFolderPath}/${templateName}`)
          .toString() // 读取模板文件
          .replace(/\${TemplateName}/g, FileName.split('.')[0])
          .replace(/\${template-name}/g, className) // 替换模板内容
        // 将templateName替换成对应的文件名
        fs.writeFileSync(`${filePath}/${FileName}`, content, 'utf8')

        console.log(colors.green('写入文件: '))
        console.log(colors.underline(`${filePath}/${FileName}`))
      })

      resolve()
    })
  },
  /**
   * 获取路径下面的文件夹
   * @param filePath // 路径
   * @param filterFolder // 过滤不需要的文件夹，默认tools跟node_modules
   */
  getFolder: function(filePath, filterFolder) {
    return new Promise(function(resolve, reject) {
      return fs.readdir(path.resolve(filePath), 'utf8', (err, files) => {
        if (!files) {
          resolve([])
          return false
        }
        filterFolder = filterFolder || []
        const filters = ['node_modules', 'dist','addFile'].concat(filterFolder)
        const f = files.filter(v => {
          return !v.includes('.') && !filters.includes(v)
        })
        resolve(f)
      })
    })
  }
}
