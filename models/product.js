const axios = require('./axiosInstance')

exports.getLikeProducts = () => {
  return axios.get('products?type=like&limit=6')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}