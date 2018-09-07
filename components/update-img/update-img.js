let { Tool, RequestFactory } = global;

Component({
  properties: {
    
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
      let callBack = (fileInfo) => {
        let tempUrl = fileInfo.data.imageUrl;
        let tempThumbUrl = fileInfo.data.imageThumbUrl;
        this.data.originalImg.push(tempUrl);
        this.data.smallImg.push(tempThumbUrl);
        this.setData({
          originalImg: this.data.originalImg,
          smallImg: this.data.smallImg
        })
        this.triggerEvent('uploadImage', { ...this.data})
      };
      let failCallback = () =>{
        clickedNum--
        this.setData({
          clickedNum: clickedNum
        })
      }
      Tool.uploadImage(1, callBack, failCallback)
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
  },
  ready: function () {
    
  }
})
