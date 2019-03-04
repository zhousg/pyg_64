//购物车相关的接口操作
const axios = require('./axiosInstance')

exports.add = (userId, id, num) => {
  return axios.post(`users/${userId}/cart`, {id, amount: num})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}