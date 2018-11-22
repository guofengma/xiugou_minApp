
// pages/my/account.js
let { Tool, RequestFactory, Storage, Event, Operation} = global

const app = getApp()

Page({
    data: {
      userInfos:'',
      tabClicked:1,
      num:0,
      pageArr:[
        "/pages/my/setting/setting", // 设置
        "/pages/my/information/information",//我的消息
        "/pages/my/my-personalData/my-personalData",//个人信息
        "/pages/my/my-account/cash/cash",// 现金账户
        "/pages/my/my-account/integral/integral",// 秀豆账户
        "/pages/my/my-account/deposit/deposit",// 待提现账户
        "/pages/my/my-order/my-order",//我的订单
        "/pages/after-sale/my-after-sale/my-after-sale", //我的售后
        "/pages/my/invite/invite",//邀请好友
        "",// 活动日历
        '/pages/my/coupon/my-coupon/my-coupon',//优惠卷
        '/pages/my/my-promotion/my-promotion', //我的数据
        "/pages/download-app/download-app",//收藏店铺
        '/pages/my/help-customer/help-customer',//帮助
        '/pages/address/select-express-address/select-express-address',//地址
        '',//足迹
        '/pages/my/task/task',//我的任务
        '/pages/my/extension/extension',//我的推广
        '/pages/discover/discover-fav/discover-fav',//发现收藏
      ]
    },
    onLoad: function (options) {
      this.didLogin()
      this.refreshMemberInfoNotice()
      Event.on('refreshMemberInfoNotice', this.refreshMemberInfoNotice, this);
      Event.on('didLogin', this.didLogin, this);  
    },
    onPullDownRefresh: function () {
      this.onLoad()
      wx.stopPullDownRefresh();
    },
    onShow: function () {
      this.setData({
        num:1
      })
      if (this.data.didLogin){
        this.getLevel()
        this.countUserOrderNum()
        this.queryPushMsg()
      }else{
        this.setData({
          countUserOrderNum:{}
        })
      }
      if (this.data.tabClicked!=1) return
      if (!this.data.didLogin) {
        Tool.navigateTo('/pages/login-wx/login-wx')
      }
      this.setData({
        tabClicked: 2
      })
      
    },
    onHide: function() {

    },
    refreshMemberInfoNotice() {
      Tool.getUserInfos(this)
    },
    queryPushMsg(){
      let callBack = (datas)=>{
        this.setData({
          pushMsg:datas
        })
      }
      app.queryPushMsg(callBack)
    },
    countUserOrderNum(){ // 获取订单数量
      let params = {
        isShowLoading: false,
        reqName: '获取用户等级',
        url: Operation.countUserOrderNum
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        this.setData({
          countUserOrderNum: datas
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();

    },
    getLevel(){
      if (!this.data.didLogin) return
      let callBack =(datas)=>{
        datas.availableBalance0 = Tool.formatNum(datas.availableBalance || 0)
        // datas.userScore0 = Tool.formatNum(datas.userScore || 0)
        datas.blockedBalance0 = Tool.formatNum(datas.blockedBalance || 0)
        Storage.setUserAccountInfo(datas)
        this.setData({
          userInfos: datas
        })
        this.getLevelInfos()
      }
      app.getLevel(callBack)
    },
    getLevelInfos() {
      let params = {
        requestMethod: 'GET',
        isShowLoading: false,
        url: Operation.getLevelInfos,
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data || []
        let userInfos = this.data.userInfos
        let levelId = userInfos.levelId
        let userExp = userInfos.experience || 0
        let levelObj = datas.filter((item) => {
          return item.id == levelId
        })
        this.setData({
          range: userExp / levelObj[0].upgradeExp *100,
          // range:40
        })
        this.initDatas()
        this.render()
        this.setData({
          levelList: datas,
        })
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    onTabItemTap(item) {
      let tabClicked = this.data.tabClicked
      // 阻止多次点击跳转
      if (tabClicked>1 && this.data.num==1){
        if (!this.data.didLogin) {
          Tool.navigateTo('/pages/login-wx/login-wx')
        }
      } 
      this.setData({
        num: 2
      })
    },
    itemClicked(e){
      if (!this.didLogin(true)) return;
      let pageIndex = e.currentTarget.dataset.page
      let query = e.currentTarget.dataset.query
      let page = this.data.pageArr[pageIndex]
      if (page==''){
        Tool.showAlert("小程序暂未开放此功能")
        return
      }
      if (query){
        page = page + "?query=" + query
      }
      if (pageIndex==12){
        Tool.switchTab(page)
      }
      Tool.navigateTo(page)
    },
    didLogin(isGoLogin){
      if (!Tool.didLogin(this)){
        if (isGoLogin){
          Tool.navigateTo('/pages/login-wx/login-wx')
        }   
        return false
      }
      return true
    },
    onUnload: function () {
      Event.off('refreshMemberInfoNotice', this.refreshMemberInfoNotice);
      Event.off('didLogin', this.didLogin);
    },
  initDatas() {
    // 使用 wx.createContext 获取绘图上下文 context
    // this.data.ctx = wx.createContext();
    this.data.ctx = wx.createCanvasContext('firstCanvas')
    // this.data.nowRange = 40;   //用于做一个临时的range
    let systemInfo = wx.getSystemInfoSync()
    //画布属性
    this.data.mW = 80 / 750 * systemInfo.windowWidth;
    this.data.mH = 80 / 750 * systemInfo.windowWidth;
    this.data.lineWidth = 1 / 750 * systemInfo.windowWidth;

    //圆属性
    this.data.r = this.data.mH / 2; //圆心
    this.data.cR = this.data.r - 2 * this.data.lineWidth; //圆半径

    //Sin 曲线属性
    this.setData({
      rate: 750 * systemInfo.windowWidth,
      nowRange: 1,//用于做一个临时的range
      sX: 0,
      axisLength: this.data.mW,//轴长
      waveWidth: 0.12,//波浪宽度,数越小越宽
      waveHeight: 0.008,//波浪高度,数越大越高
      speed: 0.04,//波浪速度，数越大速度越快
      xOffset: 10,//波浪x偏移量
      IsdrawCircled: false, // 画圈函数
      lastTime:0,
    })

    this.data.ctx.setLineWidth(this.data.lineWidth)

  },
  drawCircle() {
    let ctx = this.data.ctx
    let r = this.data.r
    let cR = this.data.cR
    ctx.beginPath();
    ctx.strokeStyle = '#FFC079';
    ctx.arc(r, r, cR + 1, 0, 2 * Math.PI);
    ctx.stroke();
    this.data.IsdrawCircled = true;
  },
  drawText() { // 写百分比文本函数
    let ctx = this.data.ctx
    this.data.ctx.save();
    let size = 0.6* this.data.cR;
    ctx.setTextAlign('center');
    ctx.setFontSize(size)
    ctx.setFillStyle('#ffffff')
    ctx.fillText(this.data.userInfos.levelRemark || '', this.data.r, this.data.r + size / 2);
    ctx.restore();
  },
  render() {
    let ctx = this.data.ctx
    ctx.clearRect(0, 0, this.data.mW, this.data.mH);

    let rangeValue = this.data.range;

    if (!this.data.IsdrawCircled) {
      this.drawCircle();
    }

    if (this.data.nowRange <= rangeValue) {
      this.data.nowRange += 1;
    }

    if (this.data.nowRange > rangeValue) {
      this.data.nowRange -= 1;
    }
    ctx.beginPath();
    ctx.arc(this.data.r, this.data.r, this.data.cR, 0, 2 * Math.PI);
    ctx.clip();
    this.drawSin(this.data.xOffset + Math.PI * 0.7, '#D01433', 18);
    this.drawSin(this.data.xOffset, '#B1021B', 18);
    this.drawText();
    this.data.xOffset += this.data.speed;
    let that = this
    ctx.draw()
    let timer = this.requestAnimationFrame(this.render);
    this.setData({
      timer:timer
    })
  },
  requestAnimationFrame(callback){
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - this.data.lastTime));
    var id = setTimeout(function () { callback(currTime + timeToCall); },
      timeToCall);
    this.data.lastTime = currTime + timeToCall;
    return id;
  },
  drawSin(xOffset, color, waveHeight) {
    let ctx = this.data.ctx
   
    
    ctx.save();

    let points = [];  //用于存放绘制Sin曲线的点

    ctx.beginPath();
    //在整个轴长上取点
    let sX = this.data.sX
    let axisLength = this.data.axisLength
    let mH = this.data.mH
    for (let x = sX; x < sX + axisLength; x += 20 / axisLength) {
      //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
      let y = Math.sin((-sX - x) * this.data.waveWidth + xOffset) * 0.2 + 0.1;

      let dY = mH * (1 - this.data.nowRange / 100);

      points.push([x, dY + y * waveHeight]);
      ctx.lineTo(x, dY + y * waveHeight);
    }

    //封闭路径
    ctx.lineTo(axisLength, mH);
    ctx.lineTo(sX, mH);
    ctx.lineTo(points[0][0], points[0][1]);
    
    ctx.setFillStyle(color)
    ctx.fill();

    ctx.restore();
  },
  joinUsClicked(){
    Tool.switchTab('/pages/discover/discover')
  },
  levelClicked(){
    Tool.navigateTo('/pages/my/my-promotion/my-promotion')
  },
  onHide: function () {
    clearTimeout(this.data.timer)
  },
})