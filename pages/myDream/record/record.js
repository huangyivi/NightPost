const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    isrecording: false,
    isplaying: false,
    scaleAnimation: null,
    moveAnimation: null,
    done: false,
    duration: '',
    currentTime: 0
  },
  // 录音
  tempVoice: '',
  innerAudio: null,
  recordManager: null,
  recordTimer: null,
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })

  },
  onLoad() {
    let that = this;
    // 如果本地有缓存录音
    if(app.globalData.voice) {
      this.setData({
        done: true
      })
      this.tempVoice = app.globalData.voice;  
      this.innerAudio = wx.createInnerAudioContext();
      this.innerAudio.src = this.tempVoice;
      this.innerAudio.onPlay(() =>{
        // 解决自然结束后无法继续更新时间
        that.innerAudio.paused;
        that.innerAudio.onTimeUpdate(function() {
          that.setData({
            currentTime: Math.floor(that.innerAudio.currentTime),
            duration: Math.floor(that.innerAudio.duration)
          })
        })
      })
      this.innerAudio.onEnded(() => {
        that.setData({
          isplaying: false,
          currentTime: 0
        })
      })
      this.innerAudio.onError((err)=>{
        wx.showModal({
          title: "播放出错了",
          content: err.errMsg,
          showCancel: false
        })
      })
    }
    // 获取全局录音管理
    this.recordManager = wx.getRecorderManager();
    this.recordManager.onStart(function (res) {
      console.log('录音开始');
    })
    this.recordManager.onStop(function (result) {
      console.log('录音结束');
      console.log(result.tempFilePath);
      that.tempVoice = result.tempFilePath;
      that.innerAudio = wx.createInnerAudioContext();
      that.innerAudio.src = that.tempVoice;
      that.innerAudio.onPlay(() =>{
        // 解决自然结束后无法继续更新时间
        that.innerAudio.paused;
        that.innerAudio.onTimeUpdate(function() {
          that.setData({
            currentTime: Math.floor(that.innerAudio.currentTime),
            duration: Math.floor(that.innerAudio.duration)
          })
        })
      })
      that.innerAudio.onEnded(() => {
        that.setData({
          isplaying: false,
          currentTime: 0
        })
      })
      that.innerAudio.onError((err)=>{
        wx.showModal({
          title: "播放出错了",
          content: err.errMsg,
          showCancel: false
        })
      })
    })
    this.recordManager.onError(err=>{
      wx.showModal({
        title: "录音出错了",
        content: err.errMsg,
        showCancel: false
      })
    }) 
    
  },
  record() {
    if (!this.data.isrecording) {
      this.setData({
        isrecording: true,
        done: false,
        duration: 0
      })

      // 动画
      let scale = wx.createAnimation({
        duration: 1000,
        timingFunction: "linear",
      })

      let move = wx.createAnimation({
        duration: 1000,
        timingFunction: "ease"
      })

      this.scale = scale;
      this.move = move;
      this.next = true;
      let that = this;
      this.timer = setInterval(function () {
        if (that.next) {
          that.scale.scale(1.2, 1.2).step();
          that.move.translateY(-20).step();
        } else {
          that.scale.scale(1.0, 1.0).step();
          that.move.translateY(0).step();
        }
        that.next = !that.next;
        that.setData({
          scaleAnimation: that.scale.export(),
          moveAnimation: that.move.export()
        })
      }, 1000)
      // 开始录音
      this.recordManager.start();
      // 10分钟后停止录音
      this.recordTimer = setTimeout(function () {
        that.recordManager.stop();
        that.setData({
          isrecording: false,
          done: true
        })
      }, 600000);
    } else {
      this.setData({
        isrecording: false,
        done: true
      })
      this.recordManager.stop();
      clearInterval(this.timer);
      clearTimeout(this.recordTimer);
      this.scale.scale(1.0, 1.0).step();
      this.move.translateY(0).step();
      this.setData({
        scaleAnimation: this.scale.export(),
        moveAnimation: this.move.export()
      })
    }
  },
  play() {
    let that = this;
    if (!this.data.isplaying) {
      this.setData({
        isplaying: true,
        currentTime: 0
      })
      that.innerAudio.play();
    } else {
      this.setData({
        isplaying: false,
        currentTime: 0
      })
      that.innerAudio.stop();
    }
  },
  return () {
    let that = this;
    wx.showModal({
      title: "是否返回？",
      content: '返回后将不做任何修改',
      confirmText: "确定",
      cancelText: "取消",
      success(res) {
        if (res.confirm) {
          that.tempVoice = '';
          wx.navigateBack();
        }
      }
    })
  },
  toPublish() {
    let that = this;
    wx.showModal({
      title: "是否完成？",
      confirmText: "确定",
      cancelText: "取消",
      success(res) {
        if (res.confirm) {
          app.globalData.voice = that.tempVoice;
          that.tempVoice = '';
          wx.navigateBack();
        }
      }
    })
  },
  toDelete() {
    let that = this;
    wx.showModal({
      title: "确定要删除录音吗？",
      confirmText: "确定",
      cancelText: "取消",
      success(res) {
        if (res.confirm) {
          that.tempVoice = '';
          app.globalData.voice = '';
          that.setData({
            done: false,
            currentTime: 0,
            duration: 0
          })
        }
      }
    })
  }
})