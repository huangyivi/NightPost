const app = getApp();
Page({
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    poster: '?', // 图片
    name: '尚未播放',
    author: '无名氏',
    src: '/',
    musicList: [
      { src: "../music/day.mp3", name: "早晨", author: "1111", poster: "?" },
      { src: "../music/snow.mp3", name: "雪花", author: "222", poster: "?" },
      { src: "../music/night.mp3", name: "夜晚", author: "1111", poster: "?" },
      { src: "../music/night.mp3", name: "夜晚", author: "1111", poster: "?" },
      { src: "../music/night.mp3", name: "夜晚", author: "1111", poster: "?" },
      { src: "../music/night.mp3", name: "夜晚", author: "1111", poster: "?" },
      { src: "../music/night.mp3", name: "夜晚", author: "1111", poster: "?" },
      { src: "../music/night.mp3", name: "夜晚", author: "1111", poster: "?" },
      { src: "../music/night.mp3", name: "夜晚", author: "1111", poster: "?" },
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
    // console.log(music);
    // console.log(this.data.src);
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