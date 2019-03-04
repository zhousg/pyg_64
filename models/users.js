//用户相关的接口操作
const axios = require('./axiosInstance')
//登录接口
exports.login = (username, password) => {
  return axios.post('users/login', {username, password})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}
