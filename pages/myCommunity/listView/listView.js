const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    tags: ["爱情","玄幻","怪诞"],
    tagIndex: 0,
    list:[
      {
        title: "梦的标题",
        tag:"爱情",
        date: "今日"
      },
      {
        title: "梦的标题",
        tag:"爱情",
        date: "今日"
      },
      {
        title: "梦的标题",
        tag:"爱情",
        date: "今日"
      },
      {
        title: "梦的标题",
        tag:"爱情",
        date: "今日"
      },
    ]
  },
  onReady: function(){
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function(e){
        that.data.capsuleHeight = e.height;
      }
    })
  },
  // 选择标签
  handleChangeTag(e){
    this.setData({
      tagIndex: e.detail.value
    })
  }
})