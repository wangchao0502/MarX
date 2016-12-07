# 脚手架设计思路

## 前端

## 后端

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

### 规范
controller，service，model，constant使用大驼峰命名法
controller：IndexController
service：   IndexService
