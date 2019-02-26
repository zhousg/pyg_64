//定义和首页相关的路由函数
const settingsModel = require('../models/settings')
const productModel = require('../models/product')

//渲染首页
exports.index = (req, res, next) => {
  // settingsModel.getSliders().then(data => {
  //   res.locals.sliders = data //挂载数据
  //   //res.json(res.locals)  测试数据 展示一下
  //   return productModel.getLikeProducts()
  // }).then(data=>{
  //   这样是串行操作
  // }).catch(err => next(err))

  /*1. 轮播数据获取*/
  /*2. 猜你喜欢数据获取*/

  //Promise.all()   可以执行多个异步操作 promise  而且会等 最慢的异步结果返回 才回去调用成功的回调
  //Promise.race()  可以执行多个异步操作 promise  而且只要 有异步操作返回结果 就回去调用成功的回调
  //传参 promise数组
  Promise.all([settingsModel.getSliders(), productModel.getLikeProducts()])
    .then(results => {
      //results 是所各异步操作的返回结构的集合 类型数组  结构的顺序和你传入的顺序一致
      res.locals.sliders = results[0]
      res.locals.likes = results[1]
      //res.json(res.locals)
      res.render('home.art')
    }).catch(err => {
    //只要有一个promise失败就会执行catch
    next(err)
  })
  //res.render('home.art')
}

//返回猜你喜欢json格式数据
exports.like = (req, res, next) => {
  productModel.getLikeProducts().then(data => {
    //以json格式返回
    res.json({status: 200, result: data})
  }).catch(err => {
    //next走错误处理中间件  响应客户端的是错误页面
    //next(err)
    res.json({status: 500, msg: err.message}) //ERROR对象中错误信息  message属性
  })
}