//商品详情页相关的路由函数
const productModel = require('../models/product')

exports.index = (req,res,next)=>{
  /*需求*/
  /*1. 面包屑导航 渲染*/
  /*2. 商品基本信息 渲染*/
  /*3. 商品图片 渲染*/
  /*4. 商品简介 渲染*/
  /*5. 相关商品(猜你喜欢)列表 渲染*/
  const id = req.params.id
  /*同时获取商品详情和猜你喜欢*/
  Promise.all([
    productModel.getProductById(id),
    productModel.getLikeProducts(5)
  ]).then(results=>{
    //商品详情
    res.locals.product = results[0]
    //相关商品
    res.locals.other = results[1]
    res.render('item.art')
  }).catch(err=>next(err))
}