Component({
  properties: {
    promotionFootbar: {
      type: Object,
      value: {
        className: 'footbar-primary',
        text: '设置提醒',
        textSmall: '',
        disabled: false,
      }
    },
    isIphoneX: {
      type: Boolean
    }
  },
  data: {

  },
  methods: { 
    checkPromotionFootbarInfo(p, props) {
      // let p = this.data.promotionFootbar;
      // let props = this.data.proNavData;

      // 以下是按钮文案相关
      if (props.status === 1 && props.notifyFlag) {
        p.text = '开始前3分钟提醒';
      }

      if (props.status === 2) {
        p.text = '立即拍';
        p.className = 'footbar-main';
        p.textSmall = '';
      }

      if ([3, 4, 5].includes(props.status)) {
        p.text = '已结束';
        if (props.status === 3)
          p.text = '已抢光';
        p.textSmall = '';
      }

      if (props.limitFlag) { //1 已到限购数 0 未到
        p.text = `每人限购${props.limitNumber}次`;
        p.textSmall = '(您已购买过本商品)';
      }

      if ( //什么情况下不允许点击按钮
        (props.status === 1 && props.notifyFlag) ||  //未开始已设置提醒
        [3, 4, 5].includes(props.status) || // 已售完、已结束、手动结束下
        props.limitFlag  // 购买数量已到限购数
      ) {
        p.disabled = true;
        p.className = 'footbar-disabled';
      }
      this.setData({
        promotionFootbar: p
      })
    },
  }
})
