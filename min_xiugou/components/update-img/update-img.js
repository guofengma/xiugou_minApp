let { Tool, API } = global;
import config from '../../config.js'
Component({
  properties: {
    propsOriginalImg:Array,
    propssmallImg: Array,
  },
  data: {
    originalImg:[],
    smallImg:[],
    clickedNum:0
  },
  methods: {
    //添加图片
    uploadImg() {
      let clickedNum = this.data.clickedNum
      clickedNum++
      if (clickedNum > 3) return
      this.setData({
        clickedNum: clickedNum
      })
      API.aliyunOSSUploadImage({}, {
        imgCount: 1
      }).then((res) => {
        let tempUrl = res.data;
        this.data.originalImg.push(tempUrl);
        this.data.smallImg.push(tempUrl + config.imgSizeParams.m_fill);
        this.setData({
          originalImg: this.data.originalImg,
          smallImg: this.data.smallImg
        })
        this.triggerEvent('uploadImage', { ...this.data })
      }).catch((res) => {
        console.log(res)
        clickedNum--
        this.setData({
          clickedNum: clickedNum
        })
      });
    },
    //删除图片
    deleteImg(e) {
      let clickedNum = this.data.clickedNum
      if (clickedNum == 0) return
      clickedNum--
      this.setData({
        clickedNum: clickedNum
      })
      let index = e.currentTarget.dataset.index;
      this.data.originalImg.splice(index, 1);
      this.data.smallImg.splice(index, 1);
      this.setData({
        originalImg: this.data.originalImg,
        smallImg: this.data.smallImg
      })
      this.triggerEvent('uploadImage', {...this.data})
    },
    initData(){
      if (this.data.propsOriginalImg.length > 0 && this.data.propssmallImg.length>0){
        this.setData({
          originalImg: this.data.propsOriginalImg,
          smallImg: this.data.propssmallImg,
        })
      }
    }
  },
  ready: function () {
    if (this.data.propssmallImg.length>0){
      this.setData({
        smallImg: this.data.propssmallImg,
        originalImg: this.data.propsOriginalImg
      })
    }
  }
})
