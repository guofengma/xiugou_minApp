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
    // specGroups: [{ "specId": 2, "specGroup": null }, { "specId": 5, "specGroup": [{ "specId": 1, "specGroup": [{ "specId": 3, "specGroup": [] }] }, { "specId": 3, "specGroup": [{ "specId": 1, "specGroup": [] }] }] }, { "specId": 8, "specGroup": null }, { "specId": 4, "specGroup": null }, { "specId": 1, "specGroup": [{ "specId": 6, "specGroup": [{ "specId": 3, "specGroup": [] }] }, { "specId": 3, "specGroup": [{ "specId": 6, "specGroup": [] }] }] }, { "specId": 7, "specGroup": null }, { "specId": 6, "specGroup": [{ "specId": 3, "specGroup": [{ "specId": 1, "specGroup": [] }] }, { "specId": 1, "specGroup": [{ "specId": 3, "specGroup": [] }] }] }, { "specId": 3, "specGroup": [{ "specId": 6, "specGroup": [{ "specId": 1, "specGroup": [] }] }, { "specId": 1, "specGroup": [{ "specId": 6, "specGroup": [] }] }] }],
    priceList: [{ "id": 1, "productId": 1, "specIds": "1,3,5", "spec": "红色-32G-1KG", "barCode": "bc001", "weight": 0.50000000, "volume": 0.30000000, "specImg": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/pms_1528718750.15896438!560x560.jpg", "originalPrice": 1000.00000000, "price": 1000.00000000, "stock": 10, "stockUnit": "个" }, { "id": 2, "productId": 1, "specIds": "1,3,6", "spec": "红色-64G-1KG", "barCode": "bc002", "weight": 0.50000000, "volume": 0.30000000, "specImg": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/pms_1528718750.15896438!560x560.jpg", "originalPrice": 1010.00000000, "price": 1010.00000000, "stock": 20, "stockUnit": "个" }, { "id": 3, "productId": 1, "specIds": "4,8,7", "spec": "蓝色-2KG-128G", "barCode": "bc001", "weight": 0.50000000, "volume": 0.30000000, "specImg": "https://mr-test-sg.oss-cn-hangzhou.aliyuncs.com/sharegoods/pms_1528718750.15896438!560x560.jpg", "originalPrice": 1000.00000000, "price": 1000.00000000, "stock": 10, "stockUnit": "个" },]
  },
  methods: {
    makeSureType() { 
      
      if (!this.isSelectAll()) return
      let isActive = this.data.isActive
      this.triggerEvent('subClicked', { ...this.data.selectPrdList, typeClicked: this.data.typeClicked });
      this.isVisiableClicked()
    },
    formatSpecList(){ // 格式化规格数组
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
      // console.log(this.data.productSpec)     
    },
    typeListClicked(e) { // 规格点击事件

      // 如果没有库存 那边不可点击
      let canclick = e.currentTarget.dataset.canclick
      if (canclick === false) return

      let key = e.currentTarget.dataset.key // 规格 key
      let index = e.currentTarget.dataset.index // 规格index
      let specValue = e.currentTarget.dataset.specvalue // 中文描述
      let id = e.currentTarget.dataset.id

      // 深复制数组
      let obj = [...this.data.isActive]
      obj[key] = { specValue, id, key, index }
      let spec_id = []
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] !== undefined) {
          spec_id[i] = obj[i].id
        }
      }
      // 如果二次点击同一个规格 那么去掉 只点击一次 就加入请求
      this.data.isActive.forEach((item, index) => {
        if (item) {
          if (item.id == obj[key].id) {
            spec_id[index] = undefined
            obj[key] = { key }
          }
        }
      })
      // console.log(obj)
      this.setData({
        isActive:obj,
      })
      // 获取已选规格
      let selectIds = this.getSelectIds(obj)
      let all_ids = this.filterAttrs(selectIds)
      // 已选的规格组
      let selectGroup = this.getSelectGroup(obj)
      let unselectGroup = this.getUnSelectGroup(selectGroup)

      unselectGroup.forEach((item,index)=>{
        console.log('*************************************************来自未选择规格组****************')
        this.set_block(item.list, all_ids)
        console.log(all_ids)
        console.log('*************来自未选择规格组****************')
      })
      selectGroup.forEach((item0, index0) => {
        console.log('*************************************************来自已选择规格组***************')
        console.log("来自已选的", item0)
        this.update_2(item0.list, index,obj,key)
        console.log('*************来自已选择规格组****************')
      })

      // 如果全部选择好了 渲染对应的价格和库存
      this.isSelectAllTypes()
      
    },
    isSelectAllTypes(){ // 全部选择规格以后渲染页面
      if (this.isSelectAll()) {
        console.log("全部选择好了：。。。。。。。。。。", this.data.isActive)
        let selectTypes = []
        this.data.isActive.forEach((item, index) => {
          selectTypes.push(item.id)
        })
        selectTypes = Tool.bubbleSort(selectTypes)
        let selectIds = selectTypes.join(',')
        this.data.priceList.forEach((item, index) => {
          if (item.specIds == selectIds) {
            this.setData({
              selectPrdList: item
            })
          }
          // console.log(this.data.selectPrdList)
        })
        // 显示价格
        this.showCurrentInfo()
      }
    },
    getSelectGroup(obj){ //已选的规格组
      let group = []
      obj.forEach((item,index)=>{
        if(item&&item.id){
          group.push(this.data.productSpec[item.key])
        }
      })
      console.log('已选规格组：', group)
      return group
    },
    getUnSelectGroup(selectGroup){ // 未选择的规格组
      let productSpec = [...this.data.productSpec]
      let unSelectGroup = []
      productSpec.forEach((item,index)=>{
        console.log(selectGroup.includes(item))
        if (!selectGroup.includes(item)){
          unSelectGroup.push(item)
        }
        
      })
      console.log('未选规格组：',unSelectGroup)
      return unSelectGroup
    },
    // 获取所选规格
    getSelectIds(obj){ // 点击选择的规格id;
      console.log(obj)
      // 选择的ID
      let selectIds = []
      obj.forEach((item) => {
        if (item && item.id) {
          selectIds.push(item.id)
        }
      })
      console.log("已选IDS", selectIds)
      return selectIds
    },
    // 获取所选择的规格对应的路线
    getSelectIdsline(ids){ 
      let result = [];
      this.data.priceList.forEach((item, index) => {
        let _attr = "," + item.specIds + ",";
        let _all_ids_in = true;
        for (index in ids) {
          if (_attr.indexOf("," + ids[index] + ",") == -1) {
            _all_ids_in = false;
            break;
          }
        }
        if (_all_ids_in) {
          result.push(item);
        }
      });
      console.log(result)
      return result;
    },
    // 获取经过已选节点所有线路上的全部节点 根据已经选择得属性值，得到余下还能选择的属性值
    filterAttrs(ids) {
      
      let products = this.getSelectIdsline(ids);
      let result = [];
      products.forEach((item,index)=>{
        result = result.concat(item.specIds.split(","));
      })
      console.log('余下还能选择的属性值',result)
      return result;
    },
    update_2(item,index,obj,key) {
      // 若该属性值 $li 是未选中状态的话，设置同级的其他属性是否可选

      let select_ids = this.getSelectIds(obj);
      console.log("来自update的item",item,index)
      let selectItem = null
      item.forEach((item0,index0)=>{
        if (select_ids.includes(item0.id)){
          selectItem = item0.id
        }
      })
     
      // let selectItem = item[index].id
      // console.log(selectItem)
      let select_ids2 = this.del_array_val(select_ids, selectItem);
      console.log("现在选的ID",select_ids, selectItem)

      let all_ids = this.filterAttrs(select_ids2);

      this.set_block(item, all_ids);
    },
    set_block($goods_attr, all_ids) {
      console.log("set_block",$goods_attr)
      console.log(all_ids)
      //根据 $goods_attr下的所有ß节点是否在可选节点中（all_ids） 来设置可选状态
      $goods_attr.forEach((item, index) => {
        // console.log(all_ids.includes(item.id+""+"b"))
        if (all_ids.includes(item.id + "")) {
          console.log(false)
          item.hasStock = true
        } else {
          console.log(true)
          item.hasStock = false
        }
      });
      this.setData({
        productSpec: this.data.productSpec
      })
    },
    // 去除 数组 arr中的 val ，返回一个新数组
    del_array_val(arr, val) {
      console.log(arr,val)
      var a = [];
      for (let k in arr) {
        if (arr[k] != val) {
          a.push(arr[k]);
        }
      }
      return a;
    },
    showCurrentInfo(types) { // 现在当前选择的价格
      let list = this.data.priceList
      for(let i = 0; i<list.length;i++){
        if(list[i].spec == types){
          this.setData({
            selectPrdList: list[i]
          })
          // return { index: i, id: list[i].id, typeName: list[i].spec, stock: list[i].stock}
        }
      }
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
      let tips = []
      for (let i = 0; i < this.data.productSpec.length;i++){
        tips.push(this.data.productSpec[i].name)
      }
      tips = tips.join(',')
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
    isSelectAll(isActive = this.data.isActive){ // 是否选择了所有的规格选项
      // let isActive = this.data.isActive
      let arr = isActive.filter((item)=>{
        if (item !== undefined && item.id) {
          return item
        }
      })
      if (!(arr.length == this.data.productSpec.length)) {
        return false
      }
      return true
    }
  },
  
  ready: function () {
    // this.formatSpecList()
    // console.log(this.data.specGroups)
  }
})
