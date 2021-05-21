// app.js
App({
  onLaunch() {
    // 登录
    // let that = this;
    // wx.login({
    //   success: function (res) {
    //     var code = res.code;
    //     var appId = 'wxd0748aaad95d239a';
    //     var secret = 'b71c503761d021c4eb3f20a236d1698b';
    //     wx.request({
    //       url: `http://39.99.140.114/dream/openid?appId=${appId}&code=${code}&secret=${secret}`,
    //       data: {},
    //       header: {
    //         'content-type': 'json'
    //       },
    //       method: "GET",
    //       success: function (res) {
    //         that.globalData.openId = res.data.Data;
    //       }
    //     })
    //   }
    //   });
  },
  globalData: {
    userInfo: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    imageFile: '',  // 图片暂存路径
    lastImage: [],  // 画笔笔迹
    myDream: null,  // 我的梦境
    voice: '',  // 录音暂存地址
    domain: 'http://39.99.140.114/dream/',
    openId : '',
    userId : '',  // 用户id，openid太长了，用这个标识
    dreamsList: [], // 梦境列表
    currentIndex: -1, // 梦境索引
    keyword : '恐龙'  // 梦境关键词，用于解梦
  }
})
