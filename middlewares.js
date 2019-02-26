//自定义中间件
const configs = require('./configs')
const categoryModel = require('./models/category')

//获取公用信息
exports.global = (req, res, next) => {
  //1. 网站公用的头部信息
  res.locals.site = configs.site
  //2. 分类信息
  categoryModel.getCategoryTree()
    .then(data => {
      res.locals.categoryTree = data
      next()
    }).catch(err => next(err))
}