import {
  handleRequest
} from "../../../utils/util"

const app = getApp();
// 定义资源路径
const myAudio = wx.createInnerAudioContext({});

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    dream: {
      // Type: "噩梦",
      // draw: "http://39.99.140.114/draw/666.jpg",
      // dream: "黄奕威是我儿子。。。gjfigjifjgjjj好的减肥的积分卡解放军卡机开机",
      // id: 8,
      // keyWord: "羊",
      // like: 1,
      // privacy: "y",
      // sound: "http://39.99.140.114/sound/666.mp3",
      // time: "04/01",
      // type: 2,
      // uid: 1,
    },
    time: {
      month: 0,
      day: 0
    },
    comment: [],
    content: '',
    play: false, // 音乐播放标志
    approveTag: false,
    userId: 0,
  },
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onLoad: function (option) {

    const {id} = option;
    console.log(id);
    // 设置梦境
    const dream = this.getAppDream(id);

    // 获取评论列表
    this.getCommentList(id);

    // 处理时间
    const [month, day] = dream.time.split("/");
    let time = {
      month,
      day
    }

    // 设置音频资源
    myAudio.src = dream.sound;

    this.setData({
      dream,
      time,
      userId: app.globalData.userId
    });
  },

  handleBack() {
    wx.navigateBack({
      delta: 0,
    })
  },

  // 获取评论列表
  getCommentList(id) {
    handleRequest({
      url: '/dream/com/' + id
    }).then(res => {
      console.log(res);
      const {
        Data,
        Status
      } = res.data;

      if (!Status) return wx.showToast({
        title: '获取回复失败',
        icon: "error"
      })

      this.setData({
        comment: Data
      });

    }).catch(err => {
      console.log(err);
    })
  },

  // 评论
  handleComment() {
    console.log(this.data.content);
    let {
      content
    } = this.data;
    if (!content.trim()) return wx.showToast({
      title: '请输入内容',
      icon: 'none'
    })

    const {
      uid,
      id
    } = this.data.dream;

    console.log(id, uid, app.globalData.userId);

    let data = {
      main_id: uid,
      send_id: app.globalData.userId,
      content: this.data.content,
      dream_id: id,
    }

    handleRequest({
      url: "/dream/com/add",
      method: "POST",
      data:JSON.stringify(data)
    }).then(res => {
      console.log(res);
      wx.showToast({
        title: '评论成功',
      })
      this.setData({
        content: ''
      });
      this.getCommentList(id);
    }).catch(err => {
      console.log(err);
    })
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
        methods: "get"
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

      // 更新新dream
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

  // 获取梦境
  getAppDream(id){
    const dream = app.globalData.dreamsList.find(item => item.id == id);
    return dream;
  },
  //更新全局梦境 
  updateAppDream(dream){
    const index = app.globalData.dreamsList.findIndex(item => item.id == dream.id);
    app.globalData.dreamsList[index] = dream;
    console.log(index);
  },

  // 删除评论
  deleteComment(e){
    console.log(e);
    const {id} = e.target.dataset;
    wx.showModal({
      title: '删除评论',
      content: '确认要删除你的评论吗？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      success: (result) => {
        if (result.confirm) {
          console.log("删除");
          // 删除评论，发送请求
          handleRequest({url:'/dream/com/del/'+id,method:'delete'}).then(res=>{
            console.log(res);
            const {Status} = res.data;
            wx.showToast({
              title: `删除${Status?'成功':'失败'}`,
              icon: Status?'success':'error'
            });
            setTimeout(()=>{
              this.getCommentList(this.data.dream.id);
            },1000);
          }).catch(err=>{
            wx.showToast({
              title: '服务器error',
            })
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

  }
})