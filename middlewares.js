//自定义中间件
const configs = require('./configs')
const categoryModel = require('./models/category')
const productModel = require('./models/product')
const cartModel = require('./models/cart')

//获取公用信息
exports.global = (req, res, next) => {
  //1. 网站公用的头部信息
  res.locals.site = configs.site
  //3. 用户信息
  res.locals.user = req.session.user
  //2. 分类信息
  //2.1 问题 每一次请求 都会去获取分类数据  想做缓存
  //2.2 获取一次分类数据  就存起来 全局变量保存起来
  //2.4 global 是全局对象  暴露给所有的程序使用   不建议这里保存
  //2.5 req res 对象 每次请求重新创建   req.app 对象里面做缓存
  //2.6 思路 如果缓存中有数据  走缓存  没有就发请求给接口服务器获取
  if (req.app.locals.categoryTree) {
    res.locals.categoryTree = req.app.locals.categoryTree
    next()
  } else {
    categoryModel.getCategoryTree()
      .then(data => {
        //缓存
        req.app.locals.categoryTree = data
        res.locals.categoryTree = data
        next()
      }).catch(err => next(err))
  }
}

//再定义一个头部购物车信息
exports.headCart = (req, res, next) => {
  //获取网页头部购物车需要的数据
  //商品的总数量  商品的名称的列表数组
  if (!req.session.user) {
    //cookie购物车
    const cartCookie = req.cookies[configs.cartCookie.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    //arr.reduce((prev,item)=>prev+item,0)  回调函数(上一次返回结果，当前变量的对象)   起始值（上一次返回结果）
    const cartNum = cartList.reduce((prev, item) => prev + parseInt(item.num), 0)
    const promiseArr = cartList.map((item, i) => productModel.getProductBaseById(item.id))
    Promise.all(promiseArr)
      .then(results => {
        //results 商品列表
        res.locals.headCart = {
          cartNum,
          cartList: results.map((item, i) => item.name)
        }
        next()
      }).catch(err => next(err))
  } else {
    //服务器购物车
    cartModel.list(req.session.user.id)
      .then(data => {
        res.locals.headCart = {
          cartNum: data.reduce((prev, item) => prev + parseInt(item.amount), 0),
          cartList: data.map((item, i) => item.name)
        }
        next()
      }).catch(err => next(err))
  }
}

//定义拦截登录中间件
exports.checkLogin = (req, res, next) => {
  //登录拦截
  if (!req.session.user) {
    return res.redirect('/login?returnUrl=' + encodeURIComponent(req.url))
  }
  next()
}