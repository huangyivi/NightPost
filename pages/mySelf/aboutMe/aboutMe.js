const app = getApp();
import * as echarts from "../../../utils/ec-canvas/echarts";
const { formatDate } = require('../../../utils/util')
let chart;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
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
    option: {},
    ec: {
      onInit: initChart
    },
    d1: '--',
    d2: '--',
    openId: false,
  },
  // 次数类型页面转换
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value == 1) {
      setTimeout(() => {
        let option = this.data.option;
        chart.setOption(option);
      }, 100)
    }
  },
  // 用户登录提示框和入口
  bindGetUserInfo(e) {
    let that = this;
    if (e.detail.userInfo) {
      that.login(e.detail.userInfo.nickName)
    }
  },
  // 登录
  login: function (name) {
    let that = this;
    wx.login({
      error: function () {
        wx.showModal({
          title: '获取失败',
          content: '后台链接失败，请联系管理员',
        })
      },
      success: function (res) {
        var code = res.code;
        var appId = 'wxd0748aaad95d239a';
        var secret = 'b71c503761d021c4eb3f20a236d1698b';
        wx.request({
          url: `${app.globalData.domain}openid?appId=${appId}&code=${code}&secret=${secret}`,
          data: {},
          header: {
            'content-type': 'json'
          },
          method: "GET",
          error: function () {

            wx.showModal({
              title: '获取失败',
              content: '后台链接失败，请联系管理员',
            })
          },
          success: function (res) {
            app.globalData.openId = res.data.Data;
            that.setData({ openId: true });

            // 注册
            wx.request({
              url: `${app.globalData.domain}user/register`,
              data: {
                "open_id": app.globalData.openId,
                "nickname": name
              },
              header: {
                'content-type': 'json'
              },
              method: "POST",
              error: function () {

                wx.showModal({
                  title: '获取失败',
                  content: '后台链接失败，请联系管理员',
                })
              },
              success: function (res) {
                // 获取用户ID
                wx.request({
                  url: `${app.globalData.domain}user?open_id=${app.globalData.openId}`,
                  data: {},
                  header: {
                    'content-type': 'json'
                  },
                  method: "GET",
                  error: function () {

                    wx.showModal({
                      title: '获取失败',
                      content: '后台链接失败，请联系管理员',
                    })
                  },
                  success: function (res) {

                    // 写入app和本地
                    wx.setStorage({
                      data: res.data.Data.id,
                      key: 'userId',
                    })
                    app.globalData.userId = res.data.Data.id;
                    // app.globalData.userId = 1;
                    that.getData();
                  }
                })
              }
            })
          }
        })
      }
    });
  },
  // 获取页面数据
  getData: function () {
    let that = this;
    // 总发表数
    let dataChartAll = [];
    let dataChart = [];
    let tags = ['美梦', '噩梦', '白日梦', '预知', '猎奇', '反梦', '平平淡淡', '其他'];
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.domain + 'all/' + app.globalData.userId,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      error: function () {
        wx.hideLoading();
        wx.showModal({
          title: '获取失败',
          content: '后台链接失败，请联系管理员',
        })
      },
      success: function (res) {
        wx.hideLoading();
        let data = res.data.Data;
        that.setData({
          d1: data
        });
        dataChartAll.push({
          name: '总发表数',
          value: data,
          children: []
        });
      }
    })

    // 类型统计
    wx.request({
      url: app.globalData.domain + `count/type/${app.globalData.userId}`,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      error: function () {
        wx.hideLoading();
        wx.showModal({
          title: '获取失败',
          content: '后台链接失败，请联系管理员',
        })
      },
      success: function (res) {
        wx.hideLoading();
        let data = res.data.Data;
        console.log(data);
        for(let i=0;i<data.length;i++) {
          dataChart.push({
            name: tags[i] + "("+ data[i].Count +")",
            value: data[i].Count
          })
        }
        
        that.setChart(tags, dataChart, dataChartAll); 
      }
    })


    // 总共鸣数
    wx.request({
      url: app.globalData.domain + 'user/likes/' + app.globalData.userId,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      error: function () {
        wx.hideLoading();
        wx.showModal({
          title: '获取失败',
          content: '后台链接失败，请联系管理员',
        })
      },
      success: function (res) {
        wx.hideLoading();
        let data = res.data.Data;
        that.setData({
          d2: data
        });
      }
    })
    // 梦境列表
    wx.request({
      url: app.globalData.domain + `my/` + app.globalData.userId,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      error: function () {
        wx.hideLoading();
        wx.showModal({
          title: '获取失败',
          content: '后台链接失败，请联系管理员',
        })
      },
      success: function (res) {
        wx.hideLoading();
        let data = res.data.Data;
        for (let i = 0; i < data.length; i++) {
          data[i].time = formatDate(data[i].time)
        }
        that.setData({
          dreamList: data
        });
      }
    })
    // 次数统计
    wx.request({
      url: app.globalData.domain + `count/time/${app.globalData.userId}`,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      error: function () {
        wx.hideLoading();
        wx.showModal({
          title: '获取失败',
          content: '后台链接失败，请联系管理员',
        })
      },
      success: function (res) {
        wx.hideLoading();
        let data = res.data.Data;
        let max = Math.max(data[0].Count, data[1].Count, data[2].Count, data[3].Count, data[4].Count, data[5].Count);
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
      }
    })
  },
  // 切换到梦境详细页面
  toDetail: function (val) {
    let idx = val.currentTarget.dataset.idx;
    app.globalData.dreamsList = this.data.dreamList;
    app.globalData.currentIndex = idx
    wx.navigateTo({
      url: `../../myCommunity/dreamArticle/dreamArticle`
    })
  },
  // 根据数据生成类型图表
  setChart: function (tags, dataChart, dataChartAll) {
    // 数据处理
    dataChart.sort(function (a, b) {
      return b.value - a.value
    })
    let data = [];
    data.push(dataChart[0], dataChart[1], dataChart[2]);
    let count = 0;
    for (let i = 3; i <= 7; i++) {
      count += dataChart[i].value;
    }
    data.push({
      name: '其他',
      value: count
    });
    dataChartAll[0].children = data;

    // 显示
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
        data: data,
      }]
    };
    this.setData({
      option: option
    })

  },
  // 返回次数条的高度
  getpercent: function (max, x) {
    if (x == 0) return 2;
    else return x / max * 70;
  },
  // 助眠模式
  toSleep: function () {
    wx.navigateTo({
      url: '../sleepMode/sleepMode'
    })
  },
  // 是否登录，数据回写
  onLoad: function () {
    var that = this;
    if (app.globalData.userId) {
      that.setData({ openId: true })
      that.getData();
    }
  },
  // 页面宽高
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      error: function () {
        wx.showModal({
          title: '获取失败',
          content: '后台链接失败，请联系管理员',
        })
      },
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onShow: function () {
    if (app.globalData.userId) {
      this.getData();
    }
  }
})