const inquirer = require('inquirer')
inquirer.registerPrompt('xiugouPath', require('inquirer-fuzzy-path'))
module.exports = function() {
  return inquirer.prompt([
    {
      type: 'xiugouPath',
      name: 'path',
      pathFilter: (isDirectory, nodePath) => isDirectory,
      rootPath: 'min_xiugou',
      message: '请选择放置文件夹:',
      default: 'pages/',
      suggestOnly: false
    }
  ])
}
