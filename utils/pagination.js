//目的是返回分页的HTML格式的代码
const path = require('path')
const url = require('url')
const template = require('art-template')
/**
 * options {page,total,btnNum,url}
 * */
module.exports = (options) => {
  /*1. 准备封装分页组件需要的 数据*/
  if (!(options.page && options.total)) return ''
  const {page, total} = options
  const btnNum = options.btnNum || 5 //默认5个按钮

  /*2. 准备封装分页组件需要的 模版*/
  //在  views/component/pagination.art 准备ok

  /*3. 就算 起始页码  和  结束页码*/
  /*a. 理想情况*/
  let end = page + Math.floor(btnNum / 2)
  let start = end - btnNum + 1
  /*b. end 值大于总页数*/
  end = end > total ? total : end
  start = end - btnNum + 1
  /*c. start 值小于1 */
  start = start < 1 ? 1 : start
  end = start + btnNum - 1
  /*d. end 值大于总页数*/
  end = end > total ? total : end

  /*----实现分页按钮的跳转---*/
  /*1. 需要跳转的URL地址  /list/1?sort=commend&page=1 */
  /*2. URL包含其他的传参保存不变  当前页码page字段的值改变*/
  /*3. URL操作在js中进行方便一些*/
  /*4. URL本身是字符串操作不方便 但是可以转换成对象 url内置模块 */
  /*5. url转换成对象*/
  //const urlObject = url.parse(options.url) //urlObject.query 键值对字符串
  const urlObject = url.parse(options.url, true) //urlObject.query {sort:xxx,page:xxx} 对象
  //6. 可以比较方便的修改page 但是修改的page的值 在模版内知道
  //7. 定义一个函数  可以传参  page
  const getUrl = (page) => {
    //8. 修改query中的page参数
    urlObject.query.page = page
    //9. 把对象转换成URL地址
    urlObject.search = undefined  //只有当search是undefined才会去用query拼接地址
    const urlStr = url.format(urlObject)
    return urlStr
  }
  //10. 模版内无法使用外部的变量


  /*-----实现点击确认根据输入的页码跳转------*/
  /*1. 如果通过js来实现  在浏览器运行  操作麻烦*/
  /*2. 使用form表单来  内生产其他传参的隐藏输入框  显示page输入框即可*/


  /*4. 结合数据和模版 动态生产分页HTML格式代码*/
  /*artTemplate 在浏览器端使用  template(模版ID,数据)*/
  /*artTemplate 在NODEJS使用  template(模版路径,数据)*/
  const templateUrl = path.join(__dirname, '../views/component/pagination.art')
  const html = template(templateUrl, {
    page,
    total,
    btnNum,
    start,
    end,
    getUrl,
    pathname:urlObject.pathname,
    query:urlObject.query
  })

  return html
}