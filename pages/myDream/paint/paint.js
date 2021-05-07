const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    thick : 0,
  },
  onReady: function(){
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function(e){
        that.data.capsuleHeight = e.height;
      }
    })
  },
  return() {
    wx.navigateBack();
  },
  changeThickness(e) {
    this.setData({
      thick: e.target.dataset.thick
    })
  }

})