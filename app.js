//入口文件 主体文件  使用MVC思想构建项目
//models 数据模型   获取接口服务器数据
//views  视图层     渲染页面 使用模版引擎
//controllers 控制器   组织请求对应的去进行业务处理
//public 静态资源
//utils 工具类

const Youch = require('youch')
const artTemplate = require('express-art-template')
const createError = require('http-errors')
const path = require('path')
const favicon = require('express-favicon')
const middlewares = require('./middlewares')
const routers = require('./routers')

/*1.创建web应用*/
const express = require('express')

const app = express()

app.listen(5000, () => console.log('pyg_64 server started'))

/*4.配置一些公用的中间件*/
/*4.1 配置模版引擎 art-template*/
app.engine('art', artTemplate)  //设置一个叫art的模版引擎
//默认页面被缓存了 而且被压缩了  模版引擎默认的是生产环境的配置
//debug 使用的布尔值  false 生产环境  true 开发环境  实时更新页面 不进行压缩
app.set('view options', {debug: process.env.NODE_ENV === 'development'})
/*4.2 配置静态资源暴露*/
app.use('/', express.static(path.join(__dirname, './public')))
/*4.3 浏览器会自动的发送一个网站小图片的请求  路径  https://www.baidu.com/favicon.ico  */
//建议大家使用 express-favicon 统一处理小图标
app.use(favicon(path.join(__dirname, './favicon.ico')))

//自定义的中间件
app.use(middlewares.global)

/*2.定义业务路由*/
app.use(routers)
// app.get('/', (req, res, next) => {
//   // throw createError(500, 'Server Error')
//   // res.send('server ok')
//   //res.locals.site = require('./configs').site
//   //res.render('home.art',{site:require('./configs').site})
//   res.render('home.art')
// })

/*3.错误统一处理*/
/*3.1 资源未找到*/
app.use((req, res, next) => {
  //如果请求走到这个中间件 证明所有的业务不符合URL  意思是资源为找到
  // const error = new Error('Not Found')
  // error.status = 404
  //介绍一个创建HTTP错误插件  http-errors
  next(createError(404, 'Not Found'))
})
/*3.2 程序运行错误*/
app.use((err, req, res, next) => {
  //运行的时候程序有异常走到这个中间件
  //处理错误

  //怎么判断项目运行环境
  // 在执行运行项目的命令之前可以加上 设置环境变量的命令
  // 使用的是是一个 cross-env 环境变量设置基于NODEJS的命令行工具  npm i cross-env -g
  // 跨平台 在不同的系统都可以使用   注意：设置环境变量是在内存中
  // set NODE_ENV=production && node app.js windows下好使

  //怎么获取系统的环境变量
  const env = req.app.get('env')
  //1. 如果是开发环境
  //能够直观的观察到异常信息 准确的定位到错误的代码
  if (env === 'development') {
    //把具体的错误信息输出到页面
    //使用youch包 美化错误信息  准确的定位错误的位置
    //res.send(err)
    new Youch(err, req).toHTML().then((html) => res.send(html))
  }
  //2. 如果是生产环境
  //渲染两个类型的页面  404  500 页面  美观一些
  else {
    //console.log(err.status) 响应状态码  错误代码
    //传递一个状态码给模版
    res.render('error.art', {status: err.status})
  }
})
