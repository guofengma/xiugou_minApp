let { Tool, RequestFactory, Storage, Event, Operation } = global
import WxParse from '../../../libs/wxParse/wxParse.js';

export default class ProductFactorys  {
  constructor(page) {
    this.page = page
  }
  requestFindProductByIdApp(callBack = () => { }) { // 产品详情接口请求
    let url = this.page.data.prodCode ? Operation.getProductDetailByCode : Operation.findProductByIdApp
    url = this.page.data.proNavData ? Operation.findProductByIdApp : url
    let params = {
      id: this.page.data.productId,
      code: this.page.data.prodCode,
      requestMethod: 'GET',
      reqName: '获取商品详情页',
      url: url
    }
    let r = RequestFactory.wxRequest(params);
    let productInfo = this.page.data.productInfo
    r.successBlock = (req) => {
      let datas = req.responseObject.data || {}
      this.page.data.userInfos = this.page.data.userInfos || {}
      datas.userLevelTypeName = datas.priceType == 1 ? '原价' : datas.priceType == 2 ? "拼店价" : this.page.data.userInfos.levelName + "价"
      this.page.setData({
        imgUrls: datas.productImgList,
        productInfo: datas.product,
        productInfoList: datas,
        priceList: datas.priceList, // 价格表
        productSpec: datas.specMap, // 规格描述
        productId: datas.product.id ? datas.product.id : this.page.data.productId
      })
      // 渲染表格
      let tbody = [{
        name: "table",
        attrs: {
          class: "table"
        },
        children: [],
      }]
      let tr = []
      for (let i = 0; i < datas.paramList.length; i++) {
        tr.push(
          {
            name: "tr",
            attrs: { class: "tr" },
            children: [ {
              name: "td",
              attrs: { class: 'td frist-td' },
              children: [{
                type: "text",
                text: datas.paramList[i].paramName
              }]
            },
            {
              name: "td",
              attrs: { class: 'td td2' },
              children: [{
                type: "text",
                text: datas.paramList[i].paramValue
              }]
            }
            ]
          }

        )
      }
      tbody[0].children = tr
      this.page.setData({
        nodes: tbody
      })
      let html = datas.product.content
      WxParse.wxParse('article', 'html', html, this.page, 5);
      // 执行额外需要做的操作
      callBack()
    }
    Tool.showErrMsg(r)
    r.addToQueue();
  }
  msgTipsClicked(e, didLogin) { // 轮播右上角分享点击事件
    let n = parseInt(e.currentTarget.dataset.index)
    switch (n) {
      case 1:
        if (!didLogin) {
          Tool.navigateTo('/pages/login-wx/login-wx?isBack=' + true)
        } else {
          Tool.navigateTo('/pages/my/information/information')
        }
        break;
      case 2:
        Tool.switchTab('/pages/index/index')
        break;
      case 3:

        break;
    }
  }
  goTop() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      Tool.showAlert('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。')
    }
  }
  onPageScroll(e) {
    this.page.setData({
      msgShow: false
    })
    if (e.scrollTop > 200) {
      this.page.setData({
        floorstatus: true
      });
    } else {
      this.page.setData({
        floorstatus: false
      });
    }
  }
  hiddenTips() {
    this.page.setData({
      msgShow: false
    })
  }
  onShareAppMessage(typeId,id){
    let inviteCode = this.page.data.userInfos.id || this.page.data.inviteId || ''
    let imgUrl = this.page.data.productInfo.imgUrl? this.page.data.productInfo.imgUrl : ''
    let name = this.page.data.productInfo.name.length > 10 ? this.page.data.productInfo.name.slice(0, 10) + "..." : this.page.data.productInfo.name
    return {
      title: name,
      path: `/pages/index/index?type=${typeId}&id=${id}&inviteId=${inviteCode}`,
      imageUrl: imgUrl
    }
  }
}