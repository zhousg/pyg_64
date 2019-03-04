//购物车相关的接口操作
const axios = require('./axiosInstance')

exports.add = (userId, id, num) => {
  return axios.post(`users/${userId}/cart`, {id, amount: num})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

exports.list = (userId) => {
  return axios.get(`users/${userId}/cart`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

exports.edit = (userId, id, num) => {
  return axios.patch(`users/${userId}/cart/${id}`,{amount:num})
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

exports.remove = (userId, id) => {
  return axios.delete(`users/${userId}/cart/${id}`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}