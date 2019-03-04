//定义用户相关的路由函数

//页面展示
exports.login = (req,res,next) =>{
  res.render('login.art')
}
//登录逻辑
exports.loginLogic = (req,res,next) =>{
  res.send('ok')
}