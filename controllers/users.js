//定义用户相关的路由函数
const svgCaptcha = require('svg-captcha')
const createError = require('http-errors')
const usersModel = require('../models/users')
const cartModel = require('../models/cart')
const configs = require('../configs')
//页面展示
exports.login = (req, res, next) => {
  //1. 通过 svg-captcha 的包  生产svg格式的图片   svg标签 HTML
  const captcha = svgCaptcha.createMathExpr({width: 120, height: 30, fontSize: 30})
  //2. captcha {data:svg格式图片,text:图片的内容或者公式结果}
  res.locals.svg = captcha.data
  req.session.text = captcha.text //记录结果  下次校验对比
  //需要回跳地址
  res.locals.returnUrl = req.query.returnUrl || '/member' //个人中心首页
  res.render('login.art')
}
//登录逻辑
exports.loginLogic = (req, res, next) => {
  /*需求*/
  const {username, password, captcha, auto} = req.body
  Promise.resolve().then(() => {
    /*1. 保证表单数据完整性  校验*/
    if (!(username && password && captcha)) throw createError(456, '表单必须输入完整')
    /*2. 验证码  校验*/
    if (captcha !== req.session.text) throw  createError(456, '验证码错误')
    /*3. 用户名和密码调接口  校验*/
    return usersModel.login(username, password)
  }).then(user => {
    if (!user) throw createError(456, '登入失败')
    //登录成功
    req.session.user = user

    if (auto) {
      /*4. 如果自动登录选中  准备自动登录的数据*/
      res.cookie(configs.loginCookie.key, JSON.stringify({
        id: user.id,
        pwd: user.password
      }), {expires: new Date(Date.now() + configs.loginCookie.expires), httpOnly: true})
    }
    /*5. 合并购物车*/
    /*5.1 获取客户端存储的购物车信息*/
    const cartCookie = req.cookies[configs.cartCookie.key] || '[]'
    const cartList = JSON.parse(cartCookie)
    /*5.2 会有若干条商品 分别添加到帐号下 */
    const promiseArr = cartList.map((item, i) => cartModel.add(user.id, item.id, item.num))
    return Promise.all(promiseArr)
  }).then(results=>{
    //合并成功
    /*5.3 如果全部合并成功  清除客户端的购物车信息*/
    res.clearCookie(configs.cartCookie.key)

    /*登录成功业务完成  响应客户端*/
    /*获取returnUrl 但是业务场景没有这个数据  在from的表单添加的*/
    res.redirect(req.body.returnUrl||'/member') //严谨操作
  }).catch(err => {
    /*6. 补充：错误提示统一处理*/
    /*6.1 页面展示错误提示信息*/
    /*6.2 自己创建的信息  程序运行时错误信息  456状态*/
    if (err.status === 456) {
      res.locals.msg = err.message
    } else {
      //console.log(err.response.data.message)
      if (err.response) {
        res.locals.msg = err.response.data.message || '登录失败'
      } else {
        res.locals.msg = '登录失败'
      }
    }
    /*6.3 重新生成验证码*/
    const captcha = svgCaptcha.createMathExpr({width: 120, height: 30, fontSize: 30})
    res.locals.svg = captcha.data
    req.session.text = captcha.text //记录结果  下次校验对比
    res.locals.returnUrl = req.body.returnUrl || '/member' //个人中心首页
    res.render('login.art')
  })
}

exports.logout = (req, res, next) => {
  delete req.session.user
  res.redirect('/login')
}