//定义订单相关的路由函数
const orderModel = require('../models/order')
exports.addOrder = (req, res, next) => {
  //生成订单 需要掉接口
  //需要传参  用户ID  商品的ID多个以逗号分隔
  const items = req.query.items
  orderModel.add(req.session.user.id, items)
    .then(order => {
      res.redirect('/checkout?num=' + order.order_number)
    }).catch(err => next(err))
}
exports.checkout = (req, res, next) => {
  //核对订单   结算页面
  //渲染订单信息  核对订单信息
  orderModel.item(req.query.num)
    .then(order => {
      res.locals.order = order
      res.render('checkout.art')
    }).catch(err => next(err))
}

exports.list = (req, res, next) => {
  //获取全部订单数据
  orderModel.list(req.session.user.id)
    .then(list => {
      res.locals.list = list
      res.render('order.art')
    }).catch(err => next(err))
}