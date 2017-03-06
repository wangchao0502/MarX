## 环境搭建

推荐node和npm版本如下，npm4有破坏性改动，有些包可能会安装出错，所以不推荐升级。

**node v6.10.0**
**npm v3.10.10**

首先在你的bash config文件中添加以上代码（如果用的zsh，文件路径为~/.zshrc），并执行`source ~/.zshrc`使配置生效。

> alias ynpm="npm --registry=https://registry.npm.qima-inc.com"

进入到Marx项目文件

> cd MarX

安装第三方依赖

> ynpm i


**>>> 以上你的环境就配置好了 <<<**

以上环境默认需要开启本地的mysql服务和redis服务，配置文件在`server/config/mysql.json`和`server/config/redis.json`中。记得修改登陆密码哦～

注意：目前这个脚手架还比较初级，你看下下面的todolist就知道了。

## 如何使用

以下两个命令分别在两个bash窗口执行，`npm run dev`启动开发环境的node服务，
`npm run build`启动实时打包功能。

> npm run dev 或 npm start

> npm run build

如果遇到类似下面的提示，请运行`npm rebuild`命令重新编译相关依赖包

> Module version mismatch. Expected 48, got 46

## cli

```bash
create|c [options] [name]  create marx app
generate|g [type] [name]   generate model/service/controller
dev|d                      run dev server
route|r [options] [url]  
```


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

model:      Account, User

### TODO

● 完全使用Superman进行打包

● 支持LiveReload功能

○ 支持将打包错误显示在浏览器 **[不实用，推迟]**

● 开发router中间键，用更优雅的方式写router

● 每次启动项目生成一个router关联的文件

~~○ 支持yo-generator生成~~

● 开发MarX-CLI(不依赖yo)

● 通过命令展示／查询 url对应的Controller和Action

● 支持命令行自动生成前端代码，controller代码，service代码

● 将一些filter，base，middleware代码放到marx的lib中

● 动态配置boilerplate的package.json版本

● 支持dashboard启动应用

○ babel启动搞得优雅一点

○ 支持unit test

○ 支持自动生成文档

○ 开发消息队列模块

○ 开发定时任务模块

○ 开发WebSocket模块

○ 支持一键持续集成

○ 支持日志分析

○ 支持性能监控

○ 开发自己的ORM，替换sequelize

### LINKS

[SaaS系统12原则](https://12factor.net/zh_cn/)
