const app = getApp();
Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    poster: 'https://qg-recruit-video.oss-accelerate.aliyuncs.com/5c0b32560f183828e76207096a9d44c.jpg',
    src: "https://qg-recruit-video.oss-accelerate.aliyuncs.com/music/Big%20River.mp3",
    name: "Big River",
    author: "Echoes Of An Era",
    // poster: '?', // 图片.oss-accelerate.aliyuncs.com/music/Big%20River.mp3",
    // name: '尚未播放',
    // author: '无名氏',
    // src: '/',
    musicList: [
      {
        src: "https://qg-recruit-video.oss-accelerate.aliyuncs.com/music/Big%20River.mp3",
        name: "Big River",
        author: "Echoes Of An Era",
        poster: 'https://qg-recruit-video.oss-accelerate.aliyuncs.com/5c0b32560f183828e76207096a9d44c.jpg'
      },
      {
        src: "https://qg-recruit-video.oss-accelerate.aliyuncs.com/music/Sailing%20to%20a%20hidden%20cove.mp3",
        name: "Sailing to a hidden cove",
        author: "Classical Artists",
        poster: 'https://qg-recruit-video.oss-accelerate.aliyuncs.com/ade925295c7cc8bbf2a2e1535a4e063.jpg'
      },
      {
        src: "https://qg-recruit-video.oss-accelerate.aliyuncs.com/music/%E6%98%A5%E6%BC%BE.mp3",
        name: "春漾",
        author: "Matthew Lien",
        poster: 'https://qg-recruit-video.oss-accelerate.aliyuncs.com/ea749fabdf9569d0173182955ad42f1.jpg'
      },
    ],
    isStart: false,
  },

  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  toAboutme: function () {
    wx.navigateBack()
  },

  startMusic: function (val) {
    let music = val.currentTarget.dataset.music;
    this.setData({
      src: music.src,
      name: music.name,
      author: music.author,
      poster: music.poster,
    })
    this.audioCtx.play();
    this.setData({
      isStart: true
    })
  },

  toggleMusic: function () {
    if (this.data.isStart) {
      this.audioCtx.pause();
      this.setData({
        isStart: false
      })
    } else {
      this.audioCtx.play();
      this.setData({
        isStart: true
      })
    }
  }
})