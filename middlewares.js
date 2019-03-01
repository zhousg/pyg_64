//自定义中间件
const configs = require('./configs')
const categoryModel = require('./models/category')

//获取公用信息
exports.global = (req, res, next) => {
  //1. 网站公用的头部信息
  res.locals.site = configs.site
  //2. 分类信息
  //2.1 问题 每一次请求 都会去获取分类数据  想做缓存
  //2.2 获取一次分类数据  就存起来 全局变量保存起来
  //2.4 global 是全局对象  暴露给所有的程序使用   不建议这里保存
  //2.5 req res 对象 每次请求重新创建   req.app 对象里面做缓存
  //2.6 思路 如果缓存中有数据  走缓存  没有就发请求给接口服务器获取
  if(req.app.locals.categoryTree){
    res.locals.categoryTree = req.app.locals.categoryTree
    next()
  }else{
    categoryModel.getCategoryTree()
      .then(data => {
        //缓存
        req.app.locals.categoryTree = data
        res.locals.categoryTree = data
        next()
      }).catch(err => next(err))
  }
}