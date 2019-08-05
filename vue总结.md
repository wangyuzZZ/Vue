# 总结

## 1.vue多入口设置(项目基于VUE-CLI搭建)

###1.调整目录结构

![1564990094153](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1564990094153.png)

###2.修改配置文件

####1.第一步修改build下面的utils文件

```javascript
//首先进入build文件夹下，在utils文件中添加以下代码块
{
// glob是webpack安装时依赖的一个第三方模块，还模块允许你使用 *等符号, 例如lib/*.js就是获取lib文件夹下的所有js后缀名的文件
var glob = require('glob')
// 页面模板
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 取得相应的页面路径，因为之前的配置，所以是src文件夹下的page文件夹
var PAGE_PATH = path.resolve(__dirname, '../src/page')
    // 用于做相应的merge处理
var merge = require('webpack-merge')

//多入口配置
// 通过glob模块读取page文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.entries = function() {
    var entryFiles = glob.sync(PAGE_PATH + '/*/*.js')
    var map = {}
    entryFiles.forEach((filePath) => {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        map[filename] = filePath
    })
    return map
}   
//多页面输出配置
// 与上面的多页面入口配置相同，读取page文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function() {
    let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
    let arr = []
    entryHtml.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        let conf = {
            // 模板来源
            template: filePath,
            // 文件名称
            filename: filename + '.html',
            // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
            chunks: ['manifest', 'vendor', filename],
            inject: true
        }
        if (process.env.NODE_ENV === 'production') {
            conf = merge(conf, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency'
            })
        }
        arr.push(new HtmlWebpackPlugin(conf))
    })
    return arr
    }
}
```

#### 2.第二步修改build下面的webpack.base.conf.js的入口配置 

```javascript
//将以下代码替换为
entry: { 
	app: './src/main.js'
}
//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
entry: utils.entries()
```

####3.第三步修改开发环境build下面的webpack.dev.conf.js 
```javascript
//注释掉以下代码
    new HtmlWebpackPlugin({ 
        filename: 'index.html', 
        template: 'index.html', 
        inject: true 
    }),
 //然后在↓↓↓↓↓↓↓↓↓↓↓↓↓↓后面添加concat(utils.htmlPlugin()) 如下所示
    new CopyWebpackPlugin([
    {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
    }
])
].concat(utils.htmlPlugin())
```

####4.同第三步修改build下面的webpack.prod.conf.js 

```javascript
//找到并注释掉
new HtmlWebpackPlugin({ 
    filename: config.build.index, 
    template: 'index.html', 
    inject: true, 
    minify: { 
    removeComments: true, 
    collapseWhitespace: true, 
    removeAttributeQuotes: true 
}, 
	chunksSortMode: 'dependency '
}),
//然后在↓↓↓↓↓↓↓↓↓↓↓↓↓↓后面添加concat(utils.htmlPlugin()) 如下所示
  new CopyWebpackPlugin([
    {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
    }
])
].concat(utils.htmlPlugin())
```

### 3.判断设备跳转默认入口

```javascript
//进入index.js添加下面代码
router.beforeEach((to, from, next) => {
  let userAgentInfo = navigator.userAgent;
  let Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
  let flag = true;
  for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
  if(flag){
    next()
  }else{
    window.location.href = '/main.html#/mobilehome'
  }
})

//默认访问localhost:8080+ 访问移动端localhost:8080/main.html#/mobilehome
```

