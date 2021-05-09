const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    nowclientX: ""
  },
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
  // 上拉触底
  onReachBottom() {
    console.log('上拉触底事件触发')
  },
  // 开始滑动时
  touchstart(e) {
    this.setData({
      // 距X轴的距离
      nowclientX: e.changedTouches[0].clientX
    })
  },
  // 滑动结束
  touchend(e) {
    let nowclientX = this.data.nowclientX;
    let clientX = e.changedTouches[0].clientX;
   /*  // 获取屏幕宽度
    let windowWidth = wx.getSystemInfoSync().windowWidth; */
    // 往左滑30触发，设计一定距离，防止下滑时手滑而触发
    if (nowclientX - clientX > 30) {
      wx.navigateTo({
        url: "../listView/listView"
      })
    }
  }

})