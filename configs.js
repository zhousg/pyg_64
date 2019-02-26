//维护品优购项目所有的配置项

/*1. 网站公用信息*/
exports.site = {
  title:'品优购(PYG.COM)-正品低价、品质保障、配送及时、轻松购物！',
  description:'品优购PYG.COM-专业的综合网上购物商城，为您提供正品低价的购物选择、优质便捷的服务体验。商品来自全球数十万品牌商家，囊括家电、手机、电脑、服装、居家、母婴、美妆、个护、食品、生鲜等丰富品类，满足各种购物需求。',
  Keywords:'网上购物,网上商城,家电,手机,电脑,服装,居家,母婴,美妆,个护,食品,生鲜,品优购'
}

/*2. 接口服务器配置信息*/
exports.api = {
  //baseURL:'https://ns-api.uieee.com/v1/'
  baseURL:'http://localhost:8000/v1/',
  timeout:3000,
  username:'newshop-frontend',
  password:'d8667837fce5a0270a35f4a8fa14be479fadc774'
}