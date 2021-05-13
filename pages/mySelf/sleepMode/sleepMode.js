const app = getApp();
Page({

  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    poster: '?',
    name: '此时此刻',
    author: '许巍',
    src: '?',
    musicList:[
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
      {src: "?", name: "歌曲"},
    ]
  },

  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  toAboutme: function () {
    wx.navigateTo({
      url: '../aboutMe/aboutMe'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})