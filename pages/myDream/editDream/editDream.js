const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    access: ['公开','私密'],
    accessIndex: 0,
    tags: ['怪诞','美好','噩梦','平常'],
    tagIndex: 0,
    detail: '锦瑟无端五十弦，一弦一柱思华年。庄生晓梦迷蝴蝶，望帝春心托杜鹃。沧海月明珠有泪，蓝田日暖玉生烟。此情可待成追忆？只是当时已惘然。锦瑟无端五十弦，一弦一柱思华年。庄生晓梦迷蝴蝶，望帝春心托杜鹃。沧海月明珠有泪，蓝田日暖玉生烟。此情可待成追忆？只是当时已惘然。锦瑟无端五十弦，一弦一柱思华年。'
  },
  onReady: function(){
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function(e){
        that.data.capsuleHeight = e.height;
      }
    })
  },
  isAccessedChange(e) {
    this.setData({
      accessIndex : e.detail.value
    })
  },
  isTagsChange(e) {
    this.setData({
      tagIndex : e.detail.value
    })
  }
})