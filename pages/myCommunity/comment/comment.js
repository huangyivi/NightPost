import {handleRequest} from "../../../utils/util"

const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    dream: {
      Type: "噩梦",
      draw: "http://39.99.140.114/draw/666.jpg",
      dream: "黄奕威是我儿子。。。gjfigjifjgjjj好的减肥的积分卡解放军卡机开机",
      id: 8,
      keyWord: "羊",
      like: 1,
      privacy: "y",
      sound: "http://39.99.140.114/sound/666.mp3",
      time: "04/01",
      type: 2,
      uid: 1,
    },
    time: {
      month: 0,
      day: 0
    },
    comment: [],
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
  onLoad:function(option){
    console.log(option);
    const {id} = option;
    this.getCommentList(id);
  },

  getCommentList(id){
    handleRequest({url:'/dream/com/'+id}).then(res=>{
      console.log(res);
    }).catch(err=>{
      console.log(err);
    })
  }
})