Page({
  data: {
    code:50,
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  bindinput(e){
    this.setData({
      code:e.detail.value
    })
  },
  onReady: function (e) {
    // var that = this
    // // 使用 wx.createContext 获取绘图上下文 context
    // var ctx = wx.createContext();

    // //range控件信息
    // var rangeValue = this.data.code;

    // var nowRange = 40;   //用于做一个临时的range
    // let systemInfo = wx.getSystemInfoSync()
    // //画布属性
    // var mW = 80 / 750 * systemInfo.windowWidth;
    // var mH = 80 / 750 * systemInfo.windowWidth;
    // var lineWidth = 1 / 750 * systemInfo.windowWidth;

    // //圆属性
    // var r = mH / 2; //圆心
    // var cR = r - 2 * lineWidth; //圆半径

    // //Sin 曲线属性
    // var sX = 0;
    // var axisLength = mW; //轴长
    // var waveWidth = 0.08;   //波浪宽度,数越小越宽
    // var waveHeight = 0.008; //波浪高度,数越大越高
    // var speed = 0.04; //波浪速度，数越大速度越快
    // var xOffset = 1; //波浪x偏移量

    // ctx.setLineWidth(lineWidth)

    // //画圈函数
    // var IsdrawCircled = false;
    // var drawCircle = function () {
    //   ctx.beginPath();
    //   ctx.strokeStyle = '#ffa500';
    //   ctx.arc(r, r, cR + 1, 0, 2 * Math.PI);
    //   ctx.stroke();
    //   ctx.beginPath();
    //   ctx.arc(r, r, cR, 0, 2 * Math.PI);
    //   ctx.clip();
    //   IsdrawCircled = true;
    // }

    // 画sin 曲线函数
    // var drawSin = function (xOffset, color, waveHeight) {
    //   ctx.save();

    //   var points = [];  //用于存放绘制Sin曲线的点

    //   ctx.beginPath();
    //   //在整个轴长上取点
    //   for (var x = sX; x < sX + axisLength; x += 20 / axisLength) {
    //     //此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
    //     var y = Math.sin((-sX - x) * waveWidth + xOffset) * 0.2 + 0.1;

    //     var dY = mH * (1 - nowRange / 100);

    //     points.push([x, dY + y * waveHeight]);
    //     ctx.lineTo(x, dY + y * waveHeight);
    //   }

    //   //封闭路径
    //   ctx.lineTo(axisLength, mH);
    //   ctx.lineTo(sX, mH);
    //   ctx.lineTo(points[0][0], points[0][1]);
    //   ctx.setFillStyle(color)
    //   ctx.fill();

    //   ctx.restore();
    // };

    // var render = function () {
    //   ctx.clearRect(0, 0, mW, mH);

    //   rangeValue = that.data.code;

    //   if (IsdrawCircled == false) {
    //     drawCircle();
    //   }

    //   if (nowRange <= rangeValue) {
    //     var tmp = 1;
    //     nowRange += tmp;
    //   }

    //   if (nowRange > rangeValue) {
    //     var tmp = 1;
    //     nowRange -= tmp;
    //   }

    //   drawSin(xOffset + Math.PI * 0.7, 'rgba(28, 134, 209, 0.5)', 18);
    //   drawSin(xOffset, '#1c86d1', 18);
    //   drawText();
    //   xOffset += speed;
    //   wx.drawCanvas({
    //     canvasId: 'firstCanvas',
    //     actions: ctx.getActions()
    //   })
    //   requestAnimationFrame(render);
    // }
    //写百分比文本函数
    // var drawText = function () {
    //   ctx.save();

    //   var size = 0.4 * cR;
    //   ctx.setFontSize(size);
    //   ctx.textAlign = 'center';
    //   // ctx.setFillStyle('red')
    //   ctx.fillText(~~nowRange + '%', r, r + size / 2); 

    //   ctx.restore();
    // };

    // render();
    this.initDatas()
    this.render()
  },
  initDatas(){
    // 使用 wx.createContext 获取绘图上下文 context
    this.data.ctx = wx.createContext();

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
      nowRange: 40,//用于做一个临时的range
      sX:0,
      axisLength: this.data.mW,//轴长
      waveWidth: 0.08,//波浪宽度,数越小越宽
      waveHeight: 0.008,//波浪高度,数越大越高
      speed: 0.04,//波浪速度，数越大速度越快
      xOffset: 1,//波浪x偏移量
      IsdrawCircled: false, // 画圈函数
    })

    this.data.ctx.setLineWidth(this.data.lineWidth)

  },
  drawCircle () {
    let ctx = this.data.ctx
    let r = this.data.r
    let cR = this.data.cR
    ctx.beginPath();
    ctx.strokeStyle = '#ffa500';
    ctx.arc(r, r, cR + 1, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(r, r, cR, 0, 2 * Math.PI);
    ctx.clip();
    this.data.IsdrawCircled = true;
  },
  drawText() { // 写百分比文本函数
    let ctx = this.data.ctx
    this.data.ctx.save();
    let size = 10 * this.data.cR;
    ctx.setFontSize(100)
    ctx.setTextAlign('center');
    ctx.fillText(~~this.data.nowRange + '%', this.data.r, this.data.r + size / 2); 
    ctx.restore();
  },
  render(){
    let ctx = this.data.ctx
    ctx.clearRect(0, 0, this.data.mW, this.data.mH);

    let rangeValue = this.data.code;

    if (!this.data.IsdrawCircled) {
      this.drawCircle();
    }

    if (this.data.nowRange <= rangeValue) {
      this.data.nowRange += 1;
    }

    if (this.data.nowRange > rangeValue) {
      this.data.nowRange -= 1;
    }

    this.drawSin(this.data.xOffset + Math.PI * 0.7, 'rgba(28, 134, 209, 0.5)', 18);
    this.drawSin(this.data.xOffset, '#1c86d1', 18);
    this.drawText();
    this.data.xOffset += this.data.speed;
    wx.drawCanvas({
      canvasId: 'firstCanvas',
      actions: ctx.getActions()
    })
    requestAnimationFrame(this.render);
  },
  drawSin(xOffset, color, waveHeight){
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
  }
})