// app.js
App({
  onLaunch() {
    let that = this;
    wx.getStorage({
      key: 'userId',
      success: function(res){
        that.globalData.userId = res.data;
      }
    })
  },
  globalData: {
    userInfo: null,
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    imageFile: '',  // 图片暂存路径
    lastImage: [],  // 画笔笔迹
    myDream: null,  // 我的梦境
    voice: '',  // 录音暂存地址
    domain: 'https://recruit.qgailab.com/dream/',
    openId : '',
    userId : '',  // 用户id，openid太长了，用这个标识
    dreamsList: [], // 梦境列表
    currentIndex: -1, // 梦境索引
    keyword : ''  // 梦境关键词，用于解梦
  }
})
