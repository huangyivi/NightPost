const app = getApp();
// 定义资源路径
const myAudio = wx.createInnerAudioContext({});

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    nowclientX: "",
    dream: {},
    time: {
      day: 0,
      month: 0
    },
    play: false,
  },
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onShow: function () {

   /*  // 获取页面传参
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];

    let {
      dream
    } = currentPage.options;
    dream = JSON.parse(dream);
    console.log(dream);
    // 整合一下时间，为了渲染
    const [month, day] = dream.time.split('/');
    let time = {
      day,
      month
    };

    myAudio.src = dream.sound;
    console.log(myAudio.src); */

    let index = app.globalData.currentIndex;
    
    let dream = app.globalData.dreamsList[index];

    const [month, day] = dream.time.split('/');
    let time = {
      day,
      month
    };

    myAudio.src = dream.sound;

    this.setData({
      dream,
      time
    });
  },

  onLoad: function(){
  },

  onUnload: function () {
    // myAudio = null;
  },

  // 上拉触底
  onReachBottom() {
    console.log('上拉触底事件触发');
    // 开始加载下一张梦境
    // 获取梦境总数
    const len = app.globalData.dreamsList.length;
    // 获取当前索引
    let index = ++app.globalData.currentIndex;

    if (index >= len) {
      // index = 0;
      wx.showToast({
        title: '没有其他梦境啦^_^',
        icon: 'none'
      })
      return;
    }
    app.globalData.currentIndex = parseInt(index);
    let dream = app.globalData.dreamsList[index];
    wx.showLoading({
      title: '加载中',
      duration: 1000,
      mask: true
    })
    this.setData({
      dream : dream || ''
    });
    // 更新音频
    myAudio.src = dream.sound;
    wx.pageScrollTo({
      scrollTop: 0
    });
    console.log(index);
  },

  // 处理音频播放和暂停
  handleMusic() {
    let {
      play
    } = this.data;
    if (play) {
      myAudio.pause();
    } else {
      myAudio.play();
    }
    this.setData({
      play: !play
    });
  },

  // 开始滑动时
  touchstart(e) {
    this.setData({
      // 距X轴的距离
      nowclientX: e.changedTouches[0].clientX
    })
  },

  // 滑动结束
  touchend(e) {
    let nowclientX = this.data.nowclientX;
    let clientX = e.changedTouches[0].clientX;
    /*  // 获取屏幕宽度
     let windowWidth = wx.getSystemInfoSync().windowWidth; */
    // 往左滑30触发，设计一定距离，防止上下滑动时手滑而触发
    if (nowclientX - clientX > 30) {
      wx.navigateBack({
        delta: 0,
      })
    }
  },

  // 返回页面
  handleBack() {
    wx.navigateBack({
      delta: 0,
    })
  }
})