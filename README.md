## 准备
确保全局环境下含有标准Promise的定义
确保全局环境下Object.assign函数的定义

## 使用
```
npm install --save ucar-wheel

import UcarWhell from 'ucar-wheel'

const stage = new UcarWheel(options)
```

## options初始化参数属性
键名|类型|默认值|描述
---|---|---|---
el|DOMElement|document.body|转盘父元素
width|Number|600|转盘宽度
height|Number|600|转盘高度
radius|Number|300|转盘半径
key|String|id|奖品主键名
text|String|text|奖品名称
list|Array|[]|奖品列表
size|Number|40|奖品名称字体大小
lineColor|ColorValue|#000|奖品分隔线颜色
textColor|ColorValue|#000|奖品名称颜色

## 重要提示
本插件支持显示图片icon
icon需在list中的元素内传入，如下所示
list 结构
```
list: [
  {
  icon: '{图片地址}'
  }
]
```

## API

### stage.rotateStart
转盘开始旋转

### stage.rotateEnd(id)
3s均匀减速至停止id为抽中项标识
返回一个Promise对象resolve奖品列表中的抽中项



