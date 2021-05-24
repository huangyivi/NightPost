import {
  handleRequest,
  formatDate
} from "../../../utils/util"

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
    approveTag: false
  },
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onShow: async function () {

    // 获取页面传参
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];

    let {
      uid,
      id
    } = currentPage.options;

    console.log(uid, id);

    this.getTheDream(uid, id);
    // 整合一下时间，为了渲染
    //  const [month, day] = dream.time.split('/');
    //  let time = {
    //    day,
    //    month
    //  };

    //  myAudio.src = dream.sound;
    //  console.log(myAudio.src); 

    /*   let index = app.globalData.currentIndex;
      let dream = app.globalData.dreamsList[index];

      let newTime = formatDate(dream.time);
      const [month, day] = newTime.split('/');
      let time = {
        day,
        month
      };

      // 设置音频资源
      myAudio.src = dream.sound;

      // 渲染点赞模块
      const {
        uid,
        id
      } = dream;
      const {
        data: {
          Data
        }
      } = await handleRequest({
        url: `/dream/like/check/${uid}/${id}`,
        methos: "get"
      });

      // 获取用户基本信息
      this.getUserMsg();

      this.setData({
        dream,
        time,
        approveTag: Data || false,
      }); */
  },

  onLoad: function () {},

  onUnload: function () {
    // myAudio = null;
  },

  // 处理音频播放和暂停
  handleMusic() {
    let {
      play
    } = this.data;
    // 播放中
    if (play) {
      myAudio.pause();
    }
    // 暂停中
    else {
      myAudio.play();
    }
    this.setData({
      play: !play
    });
  },

  // 点赞
  handleApprove() {
    const {
      dream: {
        uid,
        id
      }
    } = this.data;

    // 判断是否已经点赞
    handleRequest({
      url: `/dream/like/check/${uid}/${id}`,
      methos: "get"
    }).then(async res => {
      console.log("原本是否点赞:", res);

      let {
        Data,
        Status
      } = res.data;

      // 请求失败
      if (!Status) return wx.showToast({
        title: '点赞失败',
        icon: "error"
      });

      // 根据是否点赞请求不同的路径
      const url = `/dream/${!Data?'like':'unlike'}/${uid}/${id}`;
      // 根据是否点赞并发送给后台
      const {
        data
      } = await handleRequest({
        url,
        method: "get"
      });

      // 请求失败
      if (!data.Status) return wx.showToast({
        title: '点赞失败',
        icon: "error"
      });

      wx.showToast({
        title: `${!Data?'点':'取消'}赞成功`
      });

      let {
        like
      } = this.data.dream;

      // 更新梦境
      const dream = {
        ...this.data.dream,
        like: !Data ? like + 1 : like - 1,
      }
      // 更新全局梦境
      this.updateAppDream(dream);

      this.setData({
        dream,
        approveTag: !Data
      });

    }).catch(err => {
      console.log(err);
    })
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
    // 获取屏幕宽度
    let windowWidth = wx.getSystemInfoSync().windowWidth;
    if (nowclientX - clientX > Math.floor(windowWidth/4)) {
      const {
        dream
      } = this.data;
      console.log(dream);
      wx.navigateTo({
        url: `../comment/comment?id=${dream.id}`,
      })
    }
  },

  // 返回页面
  handleBack() {
    wx.navigateBack({
      delta: 0,
    })
  },

  // 获取用户基本信息
  getUserMsg() {
    var appId = 'wxd0748aaad95d239a';
    var secret = 'b71c503761d021c4eb3f20a236d1698b';

    wx.request({
      url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`,
      success: function (res) {
        console.log(res);
        const {
          access_token
        } = res.data;
        console.log(app.globalData.openId);

        wx.getSetting({
          withSubscriptions: true,
        })

        wx.request({
          url: `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${app.globalData.openId}`,
          success(res) {
            console.log(res);
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  // 获取匹配的梦境
  getTheDream(uid, id) {
    handleRequest({
      url: '/dream/match/' + uid + '/' + id,
      method: 'get'
    }).then(res => {
      console.log(res);
      const {
        Data,
        Status
      } = res.data;

      if (!Status) return false;

      // 匹配不到梦境
      if (Data.id == 0)
        return wx.showModal({
          title: '无匹配的梦境',
          content: '没有和你共鸣的梦~_~',
          showCancel: false,
          confirmText: '返回',
          success: (result) => {
            if (result.confirm) {
              console.log("返回");
              this.handleBack();
            }
          },
          fail: (err) => {
            console.log("失败");
          },
        });

      // 处理得到的梦境
      let newTime = formatDate(Data.time) || "0/0/0";
      const [month, day] = newTime.split('/');
      let time = {
        day,
        month
      };

      // 设置音频资源
      myAudio.src = Data.sound;

      // 渲染点赞模块
      // const {
      //   uid,
      //   id
      // } = dream;
      // const {
      //   data: {
      //     Data
      //   }
      // } = await handleRequest({
      //   url: `/dream/like/check/${uid}/${id}`,
      //   methos: "get"
      // });

      const dream = {
        ...Data,
        Type: this.getDreamType(Data.type)
      };

      this.setData({
        dream,
        time
      });

    }).catch(err => {
      console.log(err);
    })
  },

  // 获取梦境类型
  getDreamType(type) {
    const tags = ['美梦', '噩梦', '白日梦', '预知', '猎奇', '反梦', '平平淡淡', '其他'];
    return tags[parseInt(type)];
  },

  // 更新全局梦境
  updateAppDream(dream) {
    const index = app.globalData.dreamsList.findIndex(item => item.id == dream.id);
    app.globalData.dreamsList[index] = dream;
    console.log(index);
  }
})