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
    }
  },

  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },



  toSleep: function () {
    wx.navigateTo({
      url: '../sleepMode/sleepMode'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})