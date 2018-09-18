let { Tool, RequestFactory, Event, Storage, Operation } = global;
Page({
  data: {
    leftBarLists:[
      { name:"分类1", id:1},
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
      { name: "分类1", id: 1 },
    ],
    activeIndex:0
  },
  onLoad: function (options) {
   
  },
  search(){
    Tool.navigateTo('/pages/search/search?door=0')
  },
  leftBarClicked(e){

  }
})