const axios = require('./axiosInstance')
//5. 调用
exports.getSliders = () => {
  return axios.get('/settings/home_slides')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
  //.catch(err => return err)  会当做成功的回调
  //.catch(err => Promise.reject(err))  只要主动调用错误回调方法  下一个catch调用
}