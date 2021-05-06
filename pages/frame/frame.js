const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44
  },
  onReady: function(){
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function(e){
        that.data.capsuleHeight = e.height;
      }
    })
  }
})