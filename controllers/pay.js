const orderModel = require('../models/order')
const alipay = require('../utils/alipay')

exports.pay = (req, res, next) => {
  //进行支付
  const num = req.query.num
  //获取订单信息  需要订单编号
  orderModel.item(num)
    .then(order => {
      //获取支付地址
      const url = alipay.getPayUrl(order)
      //跳转支付宝
      res.redirect(url)
    }).catch(err => next(err))
}

exports.callback = (req, res, next) => {
  //修改订单的状态
  //获取订单的编号  req.query.out_trade_no
  //支付宝流水  req.query.trade_no
  const out_trade_no = req.query.out_trade_no
  const trade_no = req.query.trade_no
  orderModel.edit(out_trade_no, 1, trade_no)
    .then(order => {
      //成功提示 订单信息  页面展示
      res.locals.order = order
      res.render('paySuccess.art')
    }).catch(err => next(err))
}