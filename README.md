# lite-reader

LiteReader 桌面端聚合阅读 APP

应用主界面

![应用](http://markdown-1252710547.coscd.myqcloud.com/1_folder/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-27%20%E4%B8%8B%E5%8D%8816.54.06%20%E4%B8%8B%E5%8D%88.png)

查看应用的文章列表

![文章列表](http://markdown-1252710547.coscd.myqcloud.com/1_folder/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-27%20%E4%B8%8B%E5%8D%8816.54.46%20%E4%B8%8B%E5%8D%88.png)

阅读文章

![阅读文章](http://markdown-1252710547.coscd.myqcloud.com/1_folder/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-27%20%E4%B8%8B%E5%8D%8816.55.25%20%E4%B8%8B%E5%8D%88.png)

搜索应用

![搜索应用](http://markdown-1252710547.coscd.myqcloud.com/1_folder/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-27%20%E4%B8%8B%E5%8D%8816.55.43%20%E4%B8%8B%E5%8D%88.png)

查看应用并关注应用

![关注](http://markdown-1252710547.coscd.myqcloud.com/1_folder/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202018-02-27%20%E4%B8%8B%E5%8D%8816.56.13%20%E4%B8%8B%E5%8D%88.png)

## TODO

- 提供文章收藏功能
- 优化阅读体验
- 提供更多的技术网站的选项
  - 掘金
  - SegmentFault
- 首页：提供多栏目应用的整合阅读服务，便于一次性阅读多个栏目
- 话题：关于某一关键字的文章

## 构建步骤

目前需要结合[后台项目](https://github.com/chhpt/lite-reader-server)一起使用

``` bash
# 克隆项目
git clone https://github.com/chhpt/lite-reader.git

# 进入项目目录
cd lite-reader

# 安装项目依赖（需要提前安装 yarn）
yarn

# 根据平台构建应用
yarn run build
```
