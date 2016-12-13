## 环境搭建

> alias ynpm="npm --registry=https://registry.npm.qima-inc.com"

首先在你的bash config文件中添加以上代码（如果用的zsh，文件路径为~/.zshrc）

> source ~/.zshrc

更新环境配置

> cd MarX

进入到Marx项目文件

> ynpm i

安装第三方依赖


**>>> 以上你的环境就配置好了 <<<**

以上环境默认需要开启本地的mysql服务和redis服务，配置文件在`server/config/mysql.json`和`server/config/redis.json`中

注意：目前这个脚手架还比较初级，你看下下面的todolist就知道了。

## 如何使用

> npm run dev

> npm run build

以上两个命令分别在两个bash窗口执行，`npm run dev`启动开发环境的node服务，
`npm run build`启动实时打包功能。

## 脚手架设计思路

### 前端

入口文件都叫做main.js，打包工具会自动扫描。

### 后端

controller：直接调用service代码，不可以直接引用model对象进行数据库操作

service：直接调用model层对象，进行数据库操作。封装不同协议接口，支持数据库操作，socket通信，rpc调用等。

model：对表接口的抽象实体，通过调用sequelize提供的接口进行直接的数据库操作。不使用关联操作。不返回raw对象。

util：可以看做Common Service，用于实现常用的分页功能，关联用户表或其他表的查询功能。

router：通过配置文件进行设置

filter：过滤器，js通过decorator实现

MQ：消息队列

schedule：定时任务

constant：常量设置

config：各种配置

#### 规范
controller，service，model文件名使用大驼峰命名法
controller：IndexController
service：   IndexService

### TODO

● 完全使用Superman进行打包

● 支持LiveReload功能

○ 支持将打包错误显示在浏览器 **[不实用，推迟]**

● 开发router中间键，用更优雅的方式写router

● 每次启动项目生成一个router关联的文件

○ 通过命令展示／查询 url对应的Controller和Action

○ 支持yo-generator生成

○ 开发MarX-CLI

○ 支持命令行自动生成前端代码，controller代码，service代码

○ 支持unit test

○ 开发消息队列模块

○ 开发定时任务模块

○ 开发WebSocket模块

○ 支持一键持续集成

○ 支持日志分析

○ 支持性能监控

○ 开发自己的ORM，替换sequelize
