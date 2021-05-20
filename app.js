// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    let that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        var appId = 'wxd0748aaad95d239a';
        var secret = 'b71c503761d021c4eb3f20a236d1698b';
        wx.request({
          url: `http://39.99.140.114/dream/openid?appId=${appId}&code=${code}&secret=${secret}`,
          data: {},
          header: {
            'content-type': 'json'
          },
          method: "GET",
          success: function (res) {
            console.log(res);
            that.globalData.openID = res.data.Data;
          }
        })
      }
    });
  },
  globalData: {
    userInfo: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    imageFile: '',
    lastImage: [],
    myDream: null,
    voice: '',
    domain: 'http://39.99.140.114/dream/',
    openId : '',
    dreamsList: [], // 梦境列表
    currentIndex: -1, // 梦境索引
  }
})
