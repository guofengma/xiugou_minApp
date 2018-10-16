# crm_mini_xiugou

秀购小程序

#  组件或者模板请在 components 文件夹中查找  部分组件和模板没有罗列在本文中
省市区组件       city-picker

数量加减         adder-subtractor

规格选择         product-specification

左滑删除         delete-bar

联系客服         contact-seller

上传图片         update-img

图片标签封装      image-sub

产品导航         nav-bar

礼包规格         gift-bag-specification

地址信息         address-info

产品信息         product-info / cart-product-info/ my-order-product-info

搜索组件         search-bar

搜索结果提示// 查询结果提示      result-tips   

iphoneX底部适配  iPhoneX-line

取消订单提示     tips-cancel-order

删除订单提示     tips-delete-order

我的订单列表组件   my-order-list

### 降价拍秒杀数据获取
先根据productid拿到商品详情信息，再根据信息中的code获取降价拍秒杀

### 降价拍秒杀部分的文案说明：
活动状态  0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束

活动未开始未设置提醒时，底部按钮文案为 '设置提醒'，右上角开始时间格式为 'X月X日X:00开抢'
活动未开始已设置提醒时，底部按钮文案为 '开始前三分钟提醒' ，右上角开始时间格式为 '明(今)天X:00开抢'

活动进行中未售完时，底部按钮文案为 '立即抢'，右上角件数框内容为 '还剩X件'
活动进行中已售完时，底部按钮文案为 '已抢光'，右上角件数框内容为 '已抢100%'

活动时间结束或手动结束时，底部按钮文案为 '已结束',  右上角不再显示倒计时与件数，展示 '活动已结束'

降价活动进行中，当前起拍价高于底价时，倒计时前的文案为 '距下次降价'
降价活动进行中，当前起拍价等于底价时，倒计时前的文案为 '距结束'

倒计时结束后会有个回调通知
秒杀专题进来秒杀商品详情页在5S后要跳到普通商品详情页（同降价拍）
秒杀活动少了个 '距下次降价' 的判断

秒杀活动结束或已抢完时，'秒杀价'文案要改成'已抢X件'

### 降价秒杀专题信息栏说明
```
  //组件用法
  <product-promotion-info 
     id="promotion"
     bind:countdown="timeout" 
     prop="{{proNavData}}"
     promotionBg="{{proNavData.status == 1 ? 'comming' : 'ing'}}" 
     promotionDesc="{{promotionDesc}}"
     promotionType="2"
  ></product-promotion-info>
```
其中
```
  //prop为专题详情接口获取的数据  
  //promotionBg控制信息栏背景色  
  //promotionDesc 是信息栏中的文案描述
  promotionDesc: {  //commingDesc和countdownDesc在组件中做了处理  typeDesc 是初始值  降价拍(起拍价)和秒杀(秒杀价)是不同的
    commingDesc: '',
    countdownDesc: '',
    typeDesc: '起拍价'
  }
  
  //promotionType  区分降价拍(2)秒杀(1)  普通的为空
```

## 注意
1. background url 不支持带空格的链接  like:
``` 
background:url(https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/timg (1).jpg)
```