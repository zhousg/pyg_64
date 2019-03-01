const axios = require('./axiosInstance')

//获取猜你喜欢的商品列表
exports.getLikeProducts = (limit) => {
  return axios.get('products?type=like&limit=' + limit)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//获取分类下的商品列表 包含 分页信息
exports.getProductByCategory = (id, page, per_page, sort) => {
  return axios.get(`categories/${id}/products?page=${page}&per_page=${per_page}&sort=${sort}`)
    .then(res => ({
      list: res.data,
      page: +res.headers['x-current-page'],
      total: +res.headers['x-total-pages']
    }))
    // res 是响应对象   理解成响应报文  （响应状态行，响应头，响应主体内容）
    // res.data 响应主体内容  json数据
    // res.headers 响应的头  包含分页信息

    .catch(err => Promise.reject(err))
}

//获取搜索关键字下的商品列表 包含 分页信息
exports.getProductBySearch = (q, page, per_page, sort) => {
  //地址栏传参  如果是中文字符或特殊字符  解析异常
  //一般URL在传递数据的时候 要转成URL编码 encodeURIComponent 解码  decodeURIComponent
  q = encodeURIComponent(q)
  return axios.get(`products?page=${page}&per_page=${per_page}&sort=${sort}&q=${q}`)
    .then(res => ({
      list: res.data,
      page: +res.headers['x-current-page'],
      total: +res.headers['x-total-pages']
    }))
    .catch(err => Promise.reject(err))
}

//获取商品详情根据ID
exports.getProductById = (id) => {
  return axios.get(`products/${id}?include=introduce,category,pictures`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}