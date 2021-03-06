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
    approveTag: false,
    uid: app.globalData.userId || -1,
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
    // this.getUserMsg();

    this.setData({
      dream,
      time,
      approveTag: Data || false,
      uid: app.globalData.userId
    });
    console.log("用户uid", this.data.uid);
  },

  // 转发
  onShareAppMessage: function () {
    return {
      title: '转发',
      path: '/pages/myCommunity/listView/listView',
      success: function () {
        console.log('成功');
      }
    }
  },

  // 上拉触底
  onReachBottom() {
    /* console.log('上拉触底事件触发');
    // 判断是否触底
    if (this.Bottom == false) {
      this.Bottom = true;
      return;
    } */
    
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
        id
      },
      uid
    } = this.data;
    console.log(uid,id);

    if(!app.globalData.openId) return wx.showToast({
      title: '请先登录!',
      icon: 'none'
    })

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
    // 往左滑30触发，设计一定距离，防止上下滑动时手滑而触发
    if (nowclientX - clientX > Math.floor(windowWidth/4)) {
      const {
        dream
      } = this.data;
      console.log(dream);
      wx.navigateTo({
        url: `../comment/comment?id=${dream.id}`,
      })
    }

    if (clientX - nowclientX >  Math.floor(windowWidth/4)) {
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

        // wx.request({
        //   url: `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${app.globalData.openId}&lang=zh_CN`,
        //   success(res) {
        //     console.log(res);
        //   },
        //   fail(err) {
        //     console.log(err);
        //   }
        // })
        wx.request({
          url: "https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token",
          method: "post",
          data: {
            component_access_token: access_token,
          },
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

  // 梦境匹配
  handleResonate() {
    const {
      dream: {
        id,
        uid
      }
    } = this.data;
    wx.navigateTo({
      url: `../dreamDetail/dreamDetail?uid=${uid}&id=${id}`,
    })
  },

  // 删除梦境
  delteDream() {
    const {uid,dream:{id}} = this.data;
    wx.showModal({
      title: '删除梦境',
      content: '真的要删除你的梦境吗？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if (result.confirm) {
          console.log("删除");
          // 删除梦境，发送请求
          handleRequest({url:`/dream/del/${uid}/${id}`,method:'delete'}).then(res=>{
            console.log(res);
            const {Status} = res.data;
            wx.showToast({
              title: `删除${Status?'成功':'失败'}`,
              icon: Status?'success':'error'
            })
            // 返回上一页
            setTimeout(()=>{
              wx.navigateBack({
                delta: 0,
              })
            },500);
          }).catch(err=>{
            console.log(err);
          })
        }
      },
      fail: (err) => {
        console.log("删除失败");
        wx.showToast({
          title: '删除失败',
        })
      },
    });
  },

  // 加载新梦境
  getNewDream() {
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
    let newTime = formatDate(dream.time);
    const [month, day] = newTime.split('/');
    let time = {
      day,
      month
    };
    wx.showLoading({
      title: '加载其他梦境中',
      duration: 1000,
      mask: true
    })
    this.setData({
      dream: dream || '',
      time
    });
    // 更新音频
    myAudio.src = dream.sound;
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

  // 重新设置全局变量的梦境，用于点赞后更新
  updateAppDream(dream) {
    const index = app.globalData.dreamsList.findIndex(item => item.id == dream.id);
    app.globalData.dreamsList[index] = dream;
    console.log(index);
  }
})