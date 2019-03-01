//购物车相关的路由业务函数
//购物车操作分为两种情况： 未登录  已登录
//未登录  购物车操作    浏览器       cookie存储
//已登录  购物车操作    PHP服务器    mysql存储
//怎么区分未登录和已登录  状态 session

exports.addCart = (req, res, next) => {
  //刷新页面的时候 重复提交
  const id = req.query.id
  const num = req.query.num

  //什么叫使用到了session
  req.session.user = {}

  //1. 加入购物车
  res.redirect(`/cart/addCartSuccess?id=${id}&num=${num}`)
}

exports.addCartSuccess = (req, res, next) => {
  //2. 渲染加入的商品信息及加入的数量
  res.send('ok')
}