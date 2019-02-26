//定义和首页相关的路由函数
const settingsModel = require('../models/settings')

exports.index = (req, res, next) => {
  /*1. 轮播数据获取*/
  settingsModel.getSliders().then(data => {
    res.locals.sliders = data //挂载数据
    res.json(res.locals)
  }).catch(err => next(err))
  /*2. 猜你喜欢数据获取*/
  /*3. 分类数据获取*/
  //res.render('home.art')
}