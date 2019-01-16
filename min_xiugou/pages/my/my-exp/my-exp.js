let { Tool, API, Storage, Event } = global
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list: [],
      expStatus: {
          1: { title: '直接邀请', icon: 'exp_invite'},
          2: { title: '间接邀请', icon: 'exp_invite'},
          3: { title: '个人交易额', icon: 'exp_trade'},
          4: { title: '直接代理交易额', icon: 'exp_trade'},
          5: { title: '间接代理交易额', icon: 'exp_trade'},
          6: { title: '周交易额', icon: 'exp_trade'},
          7: { title: '周交易频次', icon: 'exp_trade'},
          8: { title: '一次性交易额', icon: 'exp_trade'},
          9: { title: '签到', icon: 'exp_sign'},
          10: { title: '分享', icon: 'exp_share'},
          11: { title: '分享点击', icon: 'exp_share'},
          12: { title: '个人奖励金', icon: 'exp_member'},
          13: { title: '礼包', icon: 'exp_act'},
          14: { title: '经验值专区', icon: 'exp_act'},
          15: { title: '其他', icon: 'exp_act'},
          16: { title: '店铺分红', icon: 'exp_act'},
          30: { title: '30天未登录', icon: 'exp_no_login'},
          31: { title: '未达到周交易额', icon: 'exp_not_full'},
      },
      currentPage: null,
      totalPage: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const userLevelInfo = {...options};
      const width = options.experience / options.levelExperience * 100 + '%';
      this.setData({
          userLevelInfo,
          width
      });
      this.getExpList();
  },
  getExpList(page) {
      const data = {
          page: page,
          size: 10
      };
      API.getExpList(data).then(res => {
          const list = res.data.data || [];
          this.setData({
              list: this.data.list.concat(list),
              currentPage: res.data.currentPage,
              totalPage: res.data.totalPage
          })
      }).catch((res) => {
          console.log(res)
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      const data = this.data;
      if (!data.currentPage || !data.totalPage || data.currentPage === data.totalPage) {
        return;
      }
      if (data.currentPage < data.totalPage) {
        this.getExpList(data.currentPage + 1);
      }

  }
})