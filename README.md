### 搭建本地接口服务

- 创建数据库 数据库名称 newshop 
- 找到 newshop.sql 文件 导入进去
- 找到 目录 php-server/newshop 运行 start.cmd
- 如果遇到启动出现错误  vc14_redist.x86 安装补丁 重启电脑
- 建议启动不成功 使用在线的接口 https://documenter.getpostman.com/view/130308/newshop/RVncfwwX
- 使用postman接口调试  发现掉接口需要认证
- 需要在每次请求的时候携带认证信息 'newshop-frontend' => 'd8667837fce5a0270a35f4a8fa14be479fadc774'
- 在请求报文的头部进行设置 
    + username=newshop-frontend
    + password=d8667837fce5a0270a35f4a8fa14be479fadc774
- 认证信息 postman  Basic auth 进行设置