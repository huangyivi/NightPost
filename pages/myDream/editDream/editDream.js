const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    access: ['公开','私密'],
    accessIndex: 0,
    tags: ['怪诞','美好','噩梦','平常'],
    tagIndex: 0,
    title: '',
    detail: '锦瑟无端五十弦，一弦一柱思华年。庄生晓梦迷蝴蝶，望帝春心托杜鹃。沧海月明珠有泪，蓝田日暖玉生烟。此情可待成追忆？只是当时已惘然。锦瑟无端五十弦，一弦一柱思华年。庄生晓梦迷蝴蝶，望帝春心托杜鹃。沧海月明珠有泪，蓝田日暖玉生烟。此情可待成追忆？只是当时已惘然。锦瑟无端五十弦，一弦一柱思华年。',
    tempFile: ''
  },
  onReady: function(){
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function(e){
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onShow() {
    // 查看本地是否有临时梦境
    if(app.globalData.myDream) {
      const {title,detail,accessIndex,tagIndex} = app.globalData.myDream;
      this.setData({
        title,
        detail,
        accessIndex,
        tagIndex
      })
    }

    // 渲染图片
    if(app.globalData.tempFile) {
      let file = app.globalData.tempFile;
      let imgBase64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(file,'base64');
      this.data.tempFile = imgBase64;
      this.setData({
        tempFile : imgBase64
      })
    }else {
      this.data.tempFile = '';
      this.setData({
        tempFile : ''
      })
    }
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
  },
  toRecord(e) {
    wx.navigateTo({
      url: '../record/record'
    })
  },
  toPaint(e) {
    wx.navigateTo({
      url: '../paint/paint'
    })
  },
  toPublish(e) {
    wx.showModal({
      content: "准备发布您的梦境了吗？",
      confirmText: "准备好了",
      cancelText: "我再回忆回忆",
      success(res) {
        if(res.confirm) {
          app.globalData.myDream = null;
          app.globalData.tempFile = '';
          app.globalData.lastImage = [];
          wx.navigateTo({
            url: '../published/published'
          })
        }
      }
    })
  },
  onHide() {
    const {title,detail,accessIndex,tagIndex} = this.data;
    let myDream = {
      title ,
      detail,
      accessIndex,
      tagIndex
    }
    app.globalData.myDream = myDream;
  }
})