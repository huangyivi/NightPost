const app = getApp();
import * as echarts from "../../../utils/ec-canvas/echarts";
let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  let option = {
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      splitNumber: 5,
      inRange: {
        color: ['#9ACCFF', '#0091FE', '#0080FF', '#1751B2', '#013998'],
      },
    },
    series: [{
      type: 'treemap',
      roam: false,
      breadcrumb: { show: false },
      nodeClick: false,

      data: [{
        name: 'nodeA',            // First tree
        value: 100,
        children: [{
          name: 'nodeAa',       // First leaf of first tree
          value: 42
        }
          , {
          name: 'nodeAb',       // Second leaf of first tree
          value: 28
        }
          , {
          name: 'nodeAc',       // Second leaf of first tree
          value: 25
        }
          , {
          name: 'nodeAd',       // Second leaf of first tree
          value: 5
        }],

      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    type: ['次数', '类型'],
    index: 0,
    dreamList: [
      { title: "标题", day: "今日", tab: "#爱情" },
      { title: "标题", day: "今日", tab: "#爱情" },
      { title: "标题", day: "今日", tab: "#爱情" },
      { title: "标题", day: "05/04", tab: "#爱情" },
    ],
    timesList: [
      { times: 5, day: "今日", opacity: 1, height: '70%' },// 最高的
      { times: 5, day: "昨日", opacity: 0.5, height: '60%' },
      { times: 5, day: "05/07", opacity: 0.4, height: '20%' },
      { times: 5, day: "05/06", opacity: 0.3, height: '50%' },
      { times: 5, day: "05/05", opacity: 0.2, height: '10%' },
      { times: 5, day: "05/04", opacity: 0.1, height: '50%' },
    ],
    ec: {
      onInit: initChart // 3、将数据放入到里面
    },
    dataTotal: {
      d1: '22',
      d2: '33',
      d3: '44',
    }
  },

  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },


  login: function () {
    wx.showModal({
      title: '提示',
      content: '是否登录？',
      success: function (sm) {
        if (sm.confirm) {
          wx.login({
            success: function (res) {
              var code = res.code;
              var appId = 'wxd0748aaad95d239a';
              var secret = 'b71c503761d021c4eb3f20a236d1698b';
              wx.request({
                url: `http://39.99.140.114/dream/openid?appId=${appId}&code=${code}&secret=${secret}`,
                data: {},
                header: {
                  'content-type': 'json'
                },
                method: "GET",
                success: function (res) {
                  app.globalData.openID = res.data.Data;
                }
              })
            }
          });
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },


  toSleep: function () {
    wx.navigateTo({
      url: '../sleepMode/sleepMode'
    })
  },

  onLoad: function () {
    app.globalData.openID = "o_50r44VTHxq0fFoSj8IvpEaFyz0";
    // wx.checkSession({
    //   success: function () {
    //     console.log("success");
    //     //session_key 未过期，并且在本生命周期一直有效，直接发送加密字段
    //   },
    //   fail: function () {
    //     // session_key 已经失效，需要重新执行登录流程
    //     console.log("fail");
    //     wx.login({
    //       success: function (res) {
    //         var code = res.code; //返回code
    //         console.log(code);
    //         var appId = 'wxd0748aaad95d239a';
    //         var secret = 'b71c503761d021c4eb3f20a236d1698b';
    //         wx.request({
    //           url: `http://39.99.140.114/dream/openid?appId=${appId}&code=${code}&secret=${secret}`,
    //           data: {},
    //           header: {
    //             'content-type': 'json'
    //           },
    //           method: "GET",
    //           success: function (res) {
    //             console.log('res:', res);
    //             app.globalData.openID = "";
    //           }
    //         })
    //       }
    //     });
    //   }
    // })
    // 查看是否授权
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo)
    //         }
    //       })
    //     }
    //   }
    // })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    }),
      setTimeout(function () {
        // 获取 chart 实例的方式
        console.log(chart)
      }, 2000);

  },


})