//获取支付地址 = 支付宝网关 + ‘？’ + 加密后的参数
const path = require('path')
/*1. 使用第三方的包  alipay-node-sdk */
const Alipay = require('alipay-node-sdk')
/*2. 得到构造函数 实例化后去对参数进行加密*/
const alipay = new Alipay({
  //应用ID
  appId: '2016092300579138',
  //通知地址
  notifyUrl: 'http://127.0.0.1:3000/pay/notify',
  //私钥
  rsaPrivate: path.join(__dirname, './rsa_private_key.pem'),
  //公钥
  rsaPublic: path.join(__dirname, './rsa_public_key.pem'),
  //是否是测试环境
  sandbox: true,
  //加密算法类型
  signType: 'RSA2'
})

exports.getPayUrl = (order) => {
  /*3. 通过以上实例  对参数进行加密*/
  /*4. 订单不一样 参数不一样*/
  const params = alipay.pagePay({
    //支付的标题
    subject: '品优购商品',
    //具体哪一些商品
    body: order.products.map((item, i) => item.name).join('\n'),
    //商户的交易编号
    outTradeId: order.order_number,
    //超时时间
    timeout: '10m',
    //支付金额
    amount: order.total_price,
    //商品类型   虚拟 0  实物  1
    goodsType: '1',
    //二维码支付模式  确定二维码的类型
    qrPayMode: 2,
    //回调的地址
    return_url:'http://127.0.0.1:3000/pay/callback'
  })
  return 'https://openapi.alipaydev.com/gateway.do?' + params
}
