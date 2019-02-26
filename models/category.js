//分类相关的数据获取方法
const axios = require('./axiosInstance')

exports.getCategoryTree = () => {
  return axios.get('categories?format=tree')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}