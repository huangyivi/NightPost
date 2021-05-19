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
        color: ['#d2d2d2', '#acacac', '#acacac', '#7b7b7b'],
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
        }, 
        {
          name: 'nodeAb',       // Second leaf of first tree
          value: 28
        }, 
        {
          name: 'nodeAc',       // Second leaf of first tree
          value: 15
        }, 
        {
          name: 'nodeAd',       // Second leaf of first tree
          value: 15
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
    dreamList: [],
    timesList: [],
    ec: {
      onInit: initChart // 3、将数据放入到里面
    },
    dataTotal: {
      d1: '--',
      d2: '--',
    },
    openId: false,
  },

  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },


  login: function () {
    let that = this;
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
                  app.globalData.openId = res.data.Data;
                  console.log(app.globalData.openId);
                  that.setData({ openId: true });
                  that.getData();
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

  getData: function () {
    let that = this;
    wx.request({
      // url: app.globalData.domain + `count/type/1/0`,
      url: app.globalData.domain + `my/1`,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      success: function (res) {
        let data = res.data.Data;
        that.setData({
          dreamList: data
        });

      }
    })
    wx.request({
      url: app.globalData.domain + `count/time`,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      success: function (res) {
        let data = res.data.Data;
        let max = Math.max(...data);
        that.setData({
          timesList: [
            { times: data[0].Count, day: data[0].Day, opacity: 1.0, height: `${that.getpercent(max, data[0].Count)}%` },// 最高的
            { times: data[1].Count, day: data[1].Day, opacity: 0.5, height: `${that.getpercent(max, data[1].Count)}%` },
            { times: data[2].Count, day: data[2].Day, opacity: 0.4, height: `${that.getpercent(max, data[2].Count)}%` },
            { times: data[3].Count, day: data[3].Day, opacity: 0.3, height: `${that.getpercent(max, data[3].Count)}%` },
            { times: data[4].Count, day: data[4].Day, opacity: 0.2, height: `${that.getpercent(max, data[4].Count)}%` },
            { times: data[5].Count, day: data[5].Day, opacity: 0.1, height: `${that.getpercent(max, data[5].Count)}%` },
          ]
        });
        // console.log(res.data.Data);
      }
    })
  },

  getpercent: function (max, x) {
    if (x == 0) return 2;
    else return x / max * 70;
  },

  toSleep: function () {
    wx.navigateTo({
      url: '../sleepMode/sleepMode'
    })
  },

  onLoad: function () {
    this.login()
    var that = this;
    console.log("onload:", app.globalData.openId);
    if (app.globalData.openId != '')
      that.setData({ openId: true })
    // console.log("?:", that.data.openId);
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
    })
  },


})