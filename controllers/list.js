//商品列表相关的路由方法
const productModel = require('../models/product')
const categoryModel = require('../models/category')
const paginationUtil = require('../utils/pagination')

//按分类查询
exports.index = (req, res, next) => {
  //获取某一个分类下的商品列表信息 还需要 分页信息

  //获取客户端的传参
  //如果 get ?id=10  req.query
  //如果 post 看不见  req.body
  //如果  url/10  req.params

  const id = req.params.id
  const page = req.query.page || 1  //获取分页页码
  const per_page = 5 //自己约定好的
  //commend 综合 quantity 销量 market_time 新品 -price 价格升序  price 价格降序
  const sort = req.query.sort || 'commend'

  /*需求：*/
  /*1. 列表信息*/
  /*2. 分页信息*/
  /*3. 面包屑信息*/
  /*4. 排序信息*/

  // productModel.getProductByCategory(id,page,per_page)
  //   .then(data=>{
  //     res.json(data)
  //   }).catch(err=>next(err))
  //同时获取 列表分页 和 面包屑信息
  Promise.all([
    productModel.getProductByCategory(id, page, per_page, sort),
    categoryModel.getCategoryAndParent(id)
  ]).then(results => {
    //设置面包屑数据
    res.locals.breadcrumb = results[1]
    //设置当前的排序
    res.locals.sort = sort
    //设置商品列表数据
    res.locals.list = results[0].list
    //需要分页代码
    res.locals.pageHtml = paginationUtil({page: results[0].page, total: results[0].total, url: req.url})
    //artTemplate 输出的html格式的代码 默认是字符串输出  防止xss攻击 cross site script
    res.render('list.art')
  }).catch(err => next(err))
}

//按搜索关键字查询
exports.search = (req, res, next) => {
  /*需求*/
  /*1. 搜索框 显示关键字*/
  /*2. 原来面包屑位置 搜索提示*/
  /*3. 排序的位置 需要修改地址*/
  /*4. 列表渲染*/
  /*5. 分页渲染*/

  const q = req.query.q
  const sort = req.query.sort || 'commend'
  const page = req.query.page || 1
  const per_page = 5
  //根据关键字查询商品列表数据和分页数据
  productModel.getProductBySearch(q, page, per_page, sort)
    .then(data => {
      //设置 关键字 信息
      res.locals.q = q
      res.locals.sort = sort
      res.locals.list = data.list
      res.locals.pageHtml = paginationUtil({page: data.page, total: data.total, url: req.url})
      res.render('list.art')
    }).catch(err => next(err))

  //res.render('list.art')
}