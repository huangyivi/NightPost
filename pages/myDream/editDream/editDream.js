const app = getApp();
const {
  getFileName,
  getWeekday
} = require('../../../utils/util.js')
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    access: ['公开', '私密'],
    accessIndex: 0,
    tags: ['美梦', '噩梦', '白日梦', '预知','猎奇','反梦','平平淡淡','其他'],
    tagIndex: 0,
    keyword: '',
    detail: '',
    imageFile: '',
    date : {},
    animationData : null
  },
  onReady: function () {
    let that = this;
    let date = new Date();
    let dateObj = {
      month : date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
      day : date.getDate() > 9 ? date.getDate() + 1 : '0' + (date.Date() + 1),
      weekday : getWeekday(date.getDay())
    }
   
    this.setData({
      date : dateObj
    })
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onShow() {
    // 动画
    let animationData = wx.createAnimation({
      duration : 1000,
      timingFunction : 'ease'
    })
    animationData.opacity(1).step();
    this.setData({
      animationData : animationData.export()
    })
    // 查看本地是否有临时梦境
    if (app.globalData.myDream) {
      const {
        keyword,
        detail,
        accessIndex,
        tagIndex
      } = app.globalData.myDream;
      this.setData({
        keyword,
        detail,
        accessIndex,
        tagIndex
      })
    }

    // 渲染图片
    if (app.globalData.imageFile) {
      let file = app.globalData.imageFile;
      let imgBase64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(file, 'base64');
      this.setData({
        imageFile: imgBase64
      })
    } else {
      this.data.imageFile = '';
      this.setData({
        imageFile: ''
      })
    }
  },
  isAccessedChange(e) {
    this.setData({
      accessIndex: e.detail.value
    })
  },
  isTagsChange(e) {
    this.setData({
      tagIndex: e.detail.value
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
    let that = this;
    wx.showModal({
      content: "准备发布您的梦境了吗？",
      confirmText: "准备好了",
      cancelText: "还没有",
      success(res) {
        if (res.confirm) {
          // 上传图片
          if (app.globalData.imageFile) {
            // console.log(getFileName(app.globalData.imageFile));
            wx.uploadFile({
              filePath: app.globalData.imageFile,
              name: 'draw',
              url: app.globalData.domain + 'file/draw',
              success(res) {
                console.log(res);
              },
              fail(err) {
                console.log(err);
              }
            })
          }
          // 上传音频
          if (app.globalData.voice) {
            let voice = app.globalData.voice;
            console.log(getFileName(voice));
            wx.uploadFile({
              filePath: voice,
              name: 'sound',
              url: app.globalData.domain + 'file/sound',
              success(res) {
                console.log(res);
              },
              fail(err) {
                console.log(err);
              }
            })
          }
          // 上传整个梦境信息
          if (that.data.detail === '') {
            that.setData({
              detail: '用户分享梦境'
            })
          }
          let data = that.data;
          let upload = {
            "uid": "hyw",
            "keyword" : data.keyword,
            "dream": data.detail,
            "privacy": data.access == 1 ? 'y' : 'n',
            "time": new Date().getTime(),
            "type": data.tagIndex,
            "like": 0,
            "draw": getFileName(app.globalData.imageFile),
            "sound": getFileName(app.globalData.voice)
          }
          console.log(upload);
          wx.request({
            url: app.globalData.domain + 'save',
            data: upload,
            method: 'post',
            success(res) {
              console.log(res);
            },
            fail(err) {
              console.log(err);
            }
          })
          app.globalData.myDream = null;
          app.globalData.imageFile = '';
          app.globalData.lastImage = [];
          that.setData({
            accessIndex: 0,
            tagIndex: 0,
            keyword: '',
            detail: '',
            imageFile: '',
          })
          wx.navigateTo({
            url: '../published/published'
          })
        }
      }
    })
  },
  onHide() {
    const {
      keyword,
      detail,
      accessIndex,
      tagIndex
    } = this.data;
    let myDream = {
      keyword,
      detail,
      accessIndex,
      tagIndex
    }
    app.globalData.myDream = myDream;
  },
  changeVal(e) {
    let key = e.target.dataset.key;
    this.setData({
      [key] : e.detail.value
    })
  }
})