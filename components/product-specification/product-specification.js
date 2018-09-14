let { Tool, RequestFactory, Operation } = global
Component({
  properties: {
    // productSpec:Object,// 规格描述
    // specGroups:Array,
    // priceList:Array,
    showImgs:Boolean,
    imgUrl:String,
    price:Number,
  },
  data: {
    isInit:true,
    visiable:false,
    innerCount: 1, //数量
    isSelect:false,// 是否选择了商品类型
    productType: '',  // 已选择的类型
    isActive:[{index:'',val:''}],
    selectPrdList:{}, //已选的类型的商品价格等信息
    tips:'',// 提示语
    typeClicked:0, // 0 规格栏点击 1 加入购物车点击 2 立即购买点击
    productSpec: { "重量": [{ "id": 3, "specName": "重量", "specValue": "1KG" }, { "id": 4, "specName": "重量", "specValue": "2KG" }], "颜色": [{ "id": 1, "specName": "颜色", "specValue": "红色" }, { "id": 2, "specName": "颜色", "specValue": "金色" }, { "id": 8, "specName": "颜色", "specValue": "蓝色" }], "内存": [{ "id": 5, "specName": "内存", "specValue": "32G" }, { "id": 6, "specName": "内存", "specValue": "64G" }, { "id": 7, "specName": "内存", "specValue": "128G" }] },
    specGroups: [{ "specId": 2, "specGroup": null }, { "specId": 5, "specGroup": [{ "specId": 1, "specGroup": [{ "specId": 3, "specGroup": [] }] }, { "specId": 3, "specGroup": [{ "specId": 1, "specGroup": [] }] }] }, { "specId": 8, "specGroup": null }, { "specId": 4, "specGroup": null }, { "specId": 1, "specGroup": [{ "specId": 6, "specGroup": [{ "specId": 3, "specGroup": [] }] }, { "specId": 3, "specGroup": [{ "specId": 6, "specGroup": [] }] }] }, { "specId": 7, "specGroup": null }, { "specId": 6, "specGroup": [{ "specId": 3, "specGroup": [{ "specId": 1, "specGroup": [] }] }, { "specId": 1, "specGroup": [{ "specId": 3, "specGroup": [] }] }] }, { "specId": 3, "specGroup": [{ "specId": 6, "specGroup": [{ "specId": 1, "specGroup": [] }] }, { "specId": 1, "specGroup": [{ "specId": 6, "specGroup": [] }] }] }]
  },
  methods: {
    formatSpecList(){
      let lists = []
      for (let key in this.data.productSpec) {
        lists.push({
          name: key,
          list: this.data.productSpec[key]
        })
      }
      this.setData({
        productSpec: lists
      }) 
      console.log(this.data.productSpec)     
    },
    makeSureType(show){
      // 点击确定 
      if (!this.isSelectAll()) return
      let isActive = this.data.isActive
      let productType = []
      isActive.forEach((item, index) => {
        productType.push(item.val)
      })
      // 拼接已选的类型 匹配库存和价格
      let seletType = productType.join('-')
      // 显示价格
      let index = this.showCurrentInfo(seletType)

      // 如果被选择的库存小于用户输入的库存 发生在先选择数量再选择规格的情况下
      if (this.data.selectPrdList.stock < this.data.innerCount) {
        this.setData({
          innerCount: this.data.selectPrdList.stock,
        })
      }
      // 已选择的类型
      let productType2 = '已选："' + productType.join('""') + '"'
      this.setData({
        productType: productType2
      })
      if(show != true){
        this.triggerEvent('subClicked', { ...index, typeClicked: this.data.typeClicked, productType: productType2 });
        this.isVisiableClicked()
      }
    },
    showCurrentInfo(types){
      // 现在当前选择的价格
      let list = this.data.priceList
      for(let i = 0; i<list.length;i++){
        if(list[i].spec == types){
          this.setData({
            selectPrdList: list[i]
          })
          return { index: i, id: list[i].id, typeName: list[i].spec, stock: list[i].stock}
        }
      }
    },
    typeListClicked(e){
      // 选择的类型 使其 active
      this.setData({
        isInit:false
      })
      let key = e.currentTarget.dataset.key 
      let index = e.currentTarget.dataset.index
      let specValue = e.currentTarget.dataset.specvalue
      let id = e.currentTarget.dataset.id

      // 深复制数组
      let obj = [...this.data.isActive]
      // let canclick = e.currentTarget.dataset.canclick
      // if (!canclick) return
      obj[key] = {specValue,id,key,index}
      let spec_id = []
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] !== undefined) {
          spec_id[i] = obj[i].id
        }
      }
      // console.log(this.data.isActive)
      // 如果二次点击同一个规格 那么去掉 只点击一次 就加入请求
      this.data.isActive.forEach((item,index)=>{
        if(item){
          if (item.id == obj[key].id) {
            spec_id[index] = undefined
            obj[key] = {key}
          }
        }
      })

      // 数组长度等于规格清单数组长度
      spec_id.length = this.data.productSpec.length
      this.getMySpec(spec_id, key, index, obj, id)
      // this.findProductStockBySpec(spec_id, key, index,obj)
    },
    getMySpec(specIdArr, key, index, obj, id){
      if (obj.length === this.data.productSpec.length){
       
      } 
      let productSpec = this.data.productSpec
      let datas = this.data.currentSpecList ? this.data.currentSpecList.specGroup : this.data.specGroups
      datas.forEach((item)=>{
        if (item.specId == id && item.specGroup !== null && item.specGroup.length>0){
          this.setData({
            currentSpecList:item
          })
          for (let i = 0; i < specIdArr.length;i++){
            let selectId = specIdArr[i]
            if (selectId === undefined) {
              this.data.productSpec[i].list.forEach((productSpecList, productSpecListIndex) => {
                // 默认都没有库存先
                productSpec[i].list[productSpecListIndex].hasStock = false
                item.specGroup.forEach((list) => {
                  list.specGroup.forEach((subItem)=>{
                    if (subItem.specId == productSpecList.id) {
                      productSpec[i].list[productSpecListIndex].hasStock = true
                      this.setData({
                        productSpec: productSpec
                      })
                      console.log(productSpec)
                    }
                  })
                })
              })
            }
          }
          // specIdArr.forEach((selectId)=>{
          //   console.log(selectId)
            
          // })
          this.setData({
            isActive: obj
          })
          item.specGroup.forEach((list)=>{
            
            // let arrIndex = list.specGroup.indexOf(id)
            // if (arrIndex!=-1){
            //   this.setData({
            //     isActive: obj
            //   })
            // } else {
            //   let productSpec = this.data.productSpec
            //   productSpec[key].list[index].noStock = true
            //   this.setData({
            //     productSpec: productSpec
            //   })
            // }
          })
        }
      })
    },
    getTipsSpec(chooseTypes=[]){
      // 规格提示
      let tips = []
      let chooseArr = []
      for (let i = 0; i < this.data.productSpec.length; i++) {
        tips.push(this.data.productSpec[i].name)
      }
      chooseTypes.forEach((item,index)=>{
        if(item.val){
          let index = tips.indexOf(item.spec)
          if(index!=1){
            tips.splice(index,1)
          }
          chooseArr.push(item.val)
        }
      })
      // tips = "请选择"+tips.join(',')
      if(tips.length==0){
        tips = "已选: " + chooseArr.join(',')
      } else{
        tips = "请选择: " + tips.join(',')
      }
      this.setData({
        tips: tips
      })
      console.log(tips)
    },
    isVisiableClicked(n){
      // 规格选择提示拼接
      let types = n || 0
      // this.formatSpecList()
      this.getTipsSpec()
      // let tips = []
      // for (let i = 0; i < this.data.productTypeList.length;i++){
      //   tips.push(this.data.productTypeList[i].spec)
      // }
      // tips = tips.join(',')
      //是否显示模态框
      this.setData({
        visiable: !this.data.visiable,
        typeClicked: types
      })
      if (this.data.visiable){
        this.triggerEvent('hiddenTips');
      }
    },
    counterInputOnChange(e) {
      //监督数量选择的改变
      if (this.properties.productInfo.stock==0){
        Tool.showAlert('库存不足,请选择其他产品')
        return
      }
      let count = e.detail.innerCount;
      if (this.data.selectPrdList.stock < count){
        Tool.showAlert('当前产品最多只能购买' + this.data.selectPrdList.stock + '件哦~')
        count = this.data.selectPrdList.stock
      }
      this.setData({
        innerCount: count,
      })
      this.triggerEvent('counterInputOnChange', this.data.innerCount);
    },
    findProductStockBySpec(idParams, key, index ,obj){
      let productTypeList = this.properties.productTypeList
      let specId = []
      idParams.forEach((item,index)=>{
        if (item !== undefined) {
          specId.push(item)
        }
      })

      // let params = {
      //   productId: this.properties.productInfo.id,
      //   specId: specId.join(',')
      // }

      // let r = r = RequestFactory.findProductStockBySpec(params);
      let params = {
        productId: this.properties.productInfo.id,
        specId: specId.join(','),
        reqName: '详情页产品规格选择',
        isShowLoading:false,
        url: Operation.findProductStockBySpec
      }
      let r = RequestFactory.wxRequest(params);
      r.successBlock = (req) => {
        let datas = req.responseObject.data
        let isSelectAll = this.isSelectAll()
        // 已经选好所以的规格值以后 更换某个规格 但无库存的情况下置灰
        if (datas.length == 0 && isSelectAll) {
          productTypeList[key].types[index] = null
          obj[key].index = null
        }
        // 渲染没有选择的那一列是否有库存
        for (let a = 0; a < idParams.length; a++) {
          if (idParams[a] === undefined) {
            productTypeList[a].types = []
            datas.forEach((item) => {
              let idArr = item.spec_ids.split(',')
              item.idArr = idArr
              productTypeList.forEach((list, index) => {
                for (let i = 0; i < idArr.length; i++) {
                  let index = productTypeList[a].typeId.indexOf(idArr[i])
                  if (index != -1) {
                    productTypeList[a].types[index] = true
                  }
                }
              })
            })
          }
        }     
        
        // 如果返回有数据 或者 无数据的情况下并没有选完所以的规格 刷新数据
        if (datas.length > 0 || (datas.length == 0 && !isSelectAll)) {
          this.setData({
            isActive: obj,
            datas: datas
          })
        }

        // 渲染规格
        this.getTipsSpec(this.data.isActive)
        this.triggerEvent('productTypeListClicked', { productTypeList });

        // 渲染对应的库存和价格
        this.makeSureType(true)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    isSelectAll(){ // 是否选择了所有的规格选项
      let isActive = this.data.isActive
      let arr = isActive.filter((item)=>{
        if (item !== undefined && item.id) {
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
    this.formatSpecList()
    console.log(this.data.specGroups)
  }
})
