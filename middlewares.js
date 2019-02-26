//自定义中间件
const configs = require('./configs')

exports.global = (req, res, next) => {
  res.locals.site = configs.site
  next()
}