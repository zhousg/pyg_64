//提供获取  设置相关数据 的函数
const {api} = require('../configs')
//通过axios去请求php-server接口服务器
//1. 安装 npm i axios
//2. 导入
const axios = require('axios')
//3. 考虑 每次请求必须授权
//4. 自己创建新的axios实例
const instance = axios.create({
  baseURL: api.baseURL,
  timeout: api.timeout,
  //配置上认证信息
  auth: {
    username: api.username,
    password: api.password
  }
})
//5. 导出
module.exports = instance