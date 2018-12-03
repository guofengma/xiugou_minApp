let { Tool, RequestFactory } = global
Component({
  properties: {
    productTypeList:Array,
    priceList: Array,
    productInfo:Object,
    imgUrl:String,
    types:Number,
    showImgs:Boolean,
    giftPrice:Number,
    isIphoneX: Boolean
  },
  data: {
    visiable:false,
    isSelect:false,// 是否选择了商品类型
    productType: '',  // 已选择的类型
    isActive:[{index:'',val:''}],
    selectPrdList:{}, //已选的类型的商品价格等信息
    tips:''// 提示语
  },
  methods: {
    makeSureType(show){
      // 点击确定 
      if (!this.isSelectAll()) return
      let isActive = this.data.isActive
      console.log(isActive)
      let productType = []
      let priceList = []
      isActive.forEach((item, index) => {
        productType.push(item.specValues)  
        priceList.push({
          prodCode: item.prodCode,
          skuCode: item.skuCode,
          num:1,
          sourceId: item.id,
          specImg: item.specImg,
          spec: item.specValues,
          productName: item.productName,
          originalPrice: this.data.productInfo.originalPrice
        })
      })

      // 如果被选择的库存小于用户输入的库存 发生在先选择数量再选择规格的情况下
      // if (this.data.selectPrdList.stock < this.data.innerCount) {
      //   this.setData({
      //     innerCount: this.data.selectPrdList.stock,
      //   })
      // }
      // 已选择的类型
      productType = '已选："' + productType.join('""') + '"'
      this.setData({
        productType: productType
      })
      if(show != true){
        this.triggerEvent('subClicked', { productType, priceList });
        this.isVisiableClicked()
      }
    },
    typeListClicked(e){

      // 选择的类型 使其 active
      let stock = e.currentTarget.dataset.stock
      if (stock==0) return
      let key = e.currentTarget.dataset.type
      let index = e.currentTarget.dataset.index
      let val = e.currentTarget.dataset.typename // 名称
      let id = e.currentTarget.dataset.id //价格id
      // 深复制数组
      let obj = [...this.data.isActive]
      let item = this.data.productTypeList[key].value[index]
      obj[key] = { index, ...item, specName: this.data.productTypeList[key].name}
      this.setData({
        isActive: obj
      })
      this.getTipsSpec(obj)
      if (this.isSelectAll()){
        this.getGiftStock()
      }
    },
    getGiftStock(){
      let stock  = []
      this.data.isActive.forEach((item)=>{
        stock.push(item.surplusNumber)
      })
      this.setData({
        minStock: Math.min(...stock)
      })
    },
    getTipsSpec(chooseTypes = []) {
      // 规格提示
      // console.log(chooseTypes)
      let tips = []
      let chooseArr = []
      for (let i = 0; i < this.data.productTypeList.length; i++) {
        tips.push(this.data.productTypeList[i].name)
      }
      chooseTypes.forEach((item, index) => {
        if (item.productPriceId) {
          let index = tips.indexOf(item.name)
          if (index != 1) {
            tips.splice(index, 1)
          }
          chooseArr.push(item.specValues)
        }
      })
      // tips = "请选择"+tips.join(',')
      if (tips.length == 0) {
        tips = "已选: " + chooseArr.join(',')
      } else {
        tips = "请选择: " + tips.join(',')
      }
      this.setData({
        tips: tips
      })
    },
    isVisiableClicked(n){
      // 规格选择提示拼接
      this.getTipsSpec()
      //是否显示模态框
      this.setData({
        visiable: !this.data.visiable,
      })
      if (this.data.visiable){
        this.triggerEvent('hiddenTips');
      }
    },
    isSelectAll() { // 是否选择了所有的规格选项
      let isActive = this.data.isActive
      let arr = isActive.filter((item) => {
        if (item !== undefined && item.productPriceId) {
          return item
        }
      })
      if (!(arr.length == this.properties.productTypeList.length)) {
        return false
      }
      return true
    }
  },
  
  ready: function () {
    Tool.isIPhoneX(this)
  }
})
