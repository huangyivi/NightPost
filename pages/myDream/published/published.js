const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    animationData: null,
    eggCtx: ''
  },
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
    if (app.globalData.keyword) {
      wx.request({
        url: app.globalData.domain + 'explain?keyword=' + app.globalData.keyword,
        method: 'get',
        success(res) {
          console.log(res.data.Data);
          if (res.data.Data) {
            let content = res.data.Data[0].Content;
            let passage = content.join('\n&emsp;&emsp;');
            that.setData({
              eggCtx: passage
            })
          }
        }
      })
    }

  },
  onShow() {
    let move = wx.createAnimation({
      duration: 3000,
      timingFunction: "ease"
    })
    move.opacity(1).step();
    this.setData({
      animationData: move.export()
    })
  },
  return () {
    wx.navigateBack();
  },
})