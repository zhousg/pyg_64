//组织所有的路由

const express = require('express')
const router = express.Router()
const homeController = require('./controllers/home')

//添加若干个路由方法
router.get('/', homeController.index)
router.get('/like', homeController.like)
//更多的业务路由  TODO

module.exports = router


