//组织所有的路由

const express = require('express')
const router = express.Router()
const homeController = require('./controllers/home')
const listController = require('./controllers/list')
const itemController = require('./controllers/item')
const cartController = require('./controllers/cart')

//添加若干个路由方法

//首页
router.get('/', homeController.index)
router.get('/like', homeController.like)

//列表
//restFul 路径规则   url风格
router.get('/list/:id', listController.index)
router.get('/search', listController.search)

//详情
router.get('/item/:id', itemController.index)

//购物车相关
router.get('/cart/add', cartController.addCart)
router.get('/cart/addCartSuccess', cartController.addCartSuccess)


//更多的业务路由  TODO

module.exports = router


