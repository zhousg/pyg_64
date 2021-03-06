//购物车相关的路由业务函数
//购物车操作分为两种情况： 未登录  已登录
//未登录  购物车操作    浏览器       cookie存储
//已登录  购物车操作    PHP服务器    mysql存储
//怎么区分未登录和已登录  状态 session 如果登录成功 用户信息将会存在user这个字段
const configs = require('../configs')
const productModel = require('../models/product')
const cartModel = require('../models/cart')

exports.addCart = (req, res, next) => {
  //刷新页面的时候 重复提交
  const id = req.query.id   //商品ID
  const num = req.query.num  //添加的数量
  //1. 加入购物车
  if (!req.session.user) {
    //未登录
    /*a. 存储cookie  存储格式  键值对字符串  键 pyg64_cart_info 值 json字符串数组 [{id:10,num:1},...] */
    /*b. 获取指定的cookie信息  cookie拿出来最好是对象  根据key获取  中间件处理数据cookie-parser */
    /*c. 把 pyg64_cart_info 有效期  购物车的配置信息 */
    /*d. 获取出来的数据是json字符串数组  转换成数组才好操作*/
    /*e. 添加数据  正常直接追加  特殊 如果遇见相同的商品 数量累加 */
    /*f. 修改完内存中的数组  把它存储cookie中  更新cookie*/
    /*g. 重定向 添加成功提示页面*/

    const cartCookie = req.cookies[configs.cartCookie.key] || '[]' //给一个默认数据否则转换报错
    const cartList = JSON.parse(cartCookie)
    const item = cartList.find((item, i) => item.id == id)
    if (item) {
      //有相同的商品  严谨 防止字符串相加
      item.num = parseInt(item.num) + parseInt(num)
    } else {
      cartList.push({id, num})
    }
    //更新cookie
    //req获取cookie  res设置cookie
    const expires = new Date(Date.now() + configs.cartCookie.expires)
    res.cookie(configs.cartCookie.key, JSON.stringify(cartList), {expires})
    res.redirect(`/cart/addCartSuccess?id=${id}&num=${num}`)
  } else {
    //登录状态的添加购物车
    cartModel.add(req.session.user.id, id, num)
      .then(data => {
        //添加成功
        res.redirect(`/cart/addCartSuccess?id=${id}&num=${num}`)
      }).catch(err => next(err))
  }
}

exports.addCartSuccess = (req, res, next) => {
  //2. 渲染加入的商品信息及加入的数量
  //数据有 id 名称 图片 数量
  const {id, num} = req.query
  //获取商品基本信息
  productModel.getProductBaseById(id)
    .then(data => {
      res.locals.product = {
        id: data.id,
        name: data.name,
        thumbnail: data.thumbnail,
        num
      }
      res.render('cart-add.art')
    }).catch(err => next(err))
}

//展示购物车页面
exports.index = (req, res, next) => {
  //负责返回静态页面
  res.render('cart.art')
}

exports.list = (req, res, next) => {
  //负责返回购物车数据格式是json  接口
  if (!req.session.user) {
    //未登录
    /*获取cookie 转换 [{id:1,num:2},...] 符合页面要求*/
    /*根据所有商品id去获取 组织数组*/
    const cartCookie = req.cookies[configs.cartCookie.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    //注意：有多个商品
    //Promise.all('promise 数组')
    //cartList里面的数据返回一个获取商品数据的promise数组
    const promiseArr = cartList.map((item, i) => productModel.getProductBaseById(item.id))
    Promise.all(promiseArr).then(results => {
      res.json({
        code: 200,
        list: results.map((item, i) => ({
          id: item.id,
          name: item.name,
          thumbnail: item.thumbnail,
          price: item.price,
          amount: item.amount,
          num: +cartList[i].num  //cartList promiseArr results 顺序都是一样的
        }))
      })
    }).catch(err => {
      res.json({code: 500, msg: '获取购物车信息失败'})
    })
  } else {
    //获取帐号下的购物车信息
    cartModel.list(req.session.user.id)
      .then(data => {
        res.json({
          code: 200,
          list: data.map((item, i) => ({
            id: item.id,
            name: item.name,
            thumbnail: item.thumbnail,
            price: item.price,
            amount: 100,
            num: item.amount
          }))
        })
      }).catch(err => {
      res.json({code: 500, msg: '获取购物车信息失败'})
    })
  }
}

//修改购物车商品数量的接口 返回json
exports.edit = (req, res, next) => {
  //约定传参 id num 请求方式 post
  const {id, num} = req.body
  if (!req.session.user) {
    //获取购物车数据
    const cartCookie = req.cookies[configs.cartCookie.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    //修改
    const product = cartList.find((item, i) => item.id == id)
    product.num = +num
    //存储
    const expires = new Date(Date.now() + configs.cartCookie.expires)
    res.cookie(configs.cartCookie.key, JSON.stringify(cartList), {expires})
    //成功
    res.json({code: 200, msg: '修改成功'})
  } else {
    //登录状态修改购物车数量
    cartModel.edit(req.session.user.id, id, num)
      .then(data => {
        res.json({code: 200, msg: '修改成功'})
      }).catch(err => {
      res.json({code: 500, msg: '修改失败'})
    })
  }
}

//删除购物车商品接口 返回json
exports.remove = (req, res, next) => {
  const id = req.body.id   //商品ID
  if (!req.session.user) {
    //未登录
    /*1. 获取*/
    const cartCookie = req.cookies[configs.cartCookie.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    /*2. 删除*/
    //splice(index,1) 删除数组中某一项数据的操作
    const index = cartList.findIndex((item, i) => item.id == id)
    cartList.splice(index, 1)
    /*3. 存储*/
    const expires = new Date(Date.now() + configs.cartCookie.expires)
    res.cookie(configs.cartCookie.key, JSON.stringify(cartList), {expires})
    //响应
    res.json({code: 200, msg: '删除成功'})
  } else {
    //登录状态删除购物车商品
    cartModel.remove(req.session.user.id, id)
      .then(data => {
        res.json({code: 200, msg: '删除成功'})
      }).catch(err => {
      res.json({code: 500, msg: '删除失败'})
    })
  }
}