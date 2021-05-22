const app = getApp();
import * as echarts from "../../../utils/ec-canvas/echarts";
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

  bindGetUserInfo(e) {
    console.log(e.detail.userInfo);
    let that = this;
    if (e.detail.userInfo) {
      wx.showModal({
        title: '提示',
        content: '是否登录？',
        success: function (sm) {
          if (sm.confirm) {
            that.login(e.detail.userInfo.nickName)
          }
        }
      })
    }
    // 查看是否授权，问题：全是true
    // wx.getSetting({
    //   success(res) {
    //     console.log(res);
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.showModal({
    //         title: '提示',
    //         content: '是否登录？',
    //         success: function (sm) {
    //           if (sm.confirm) {
    //             that.login(e.detail.userInfo.nickName)
    //           }
    //         }
    //       })
    //     } else {
    //       that.login(e.detail.userInfo.nickName)
    //     }
    //   }
    // })

  },

  login: function (name) {
    let that = this;
    wx.login({
      success: function (res) {
        console.log(res);
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
              success: function (res) {
                console.log("register", res);

                // 获取用户ID
                wx.request({
                  url: `${app.globalData.domain}user?open_id=${app.globalData.openId}`,
                  data: {},
                  header: {
                    'content-type': 'json'
                  },
                  method: "GET",
                  success: function (res) {
                    console.log(res);
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

  getData: function () {
    let that = this;
    // 总发表数
    let dataChartAll = [];
    let dataChart = [];
    let tags = ['美梦', '噩梦', '白日梦', '预知', '猎奇', '反梦', '平平淡淡', '其他'];
    let i = 0;
    wx.request({
      url: app.globalData.domain + 'all/' + app.globalData.userId,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      success: function (res) {
        let data = res.data.Data;
        that.setData({
          d1: data
        });
        dataChartAll.push({
          name: '总发表数',
          value: data,
          children: []
        });
        // 类型统计
        // 0
        wx.request({
          url: app.globalData.domain + `count/type/${app.globalData.userId}/${i}`,
          data: {},
          header: {
            'content-type': 'json'
          },
          method: "GET",
          success: function (res) {
            let data = res.data.Data;
            dataChart.push({
              name: tags[i],
              value: data
            })
            i++;
            // 1
            wx.request({
              url: app.globalData.domain + `count/type/${app.globalData.userId}/${i}`,
              data: {},
              header: {
                'content-type': 'json'
              },
              method: "GET",
              success: function (res) {
                let data = res.data.Data;
                dataChart.push({
                  name: tags[i],
                  value: data
                })
                i++;
                // 2
                wx.request({
                  url: app.globalData.domain + `count/type/${app.globalData.userId}/${i}`,
                  data: {},
                  header: {
                    'content-type': 'json'
                  },
                  method: "GET",
                  success: function (res) {
                    let data = res.data.Data;
                    dataChart.push({
                      name: tags[i],
                      value: data
                    })
                    i++;
                    // 3
                    wx.request({
                      url: app.globalData.domain + `count/type/${app.globalData.userId}/${i}`,
                      data: {},
                      header: {
                        'content-type': 'json'
                      },
                      method: "GET",
                      success: function (res) {
                        let data = res.data.Data;
                        dataChart.push({
                          name: tags[i],
                          value: data
                        })
                        i++;
                        // 4
                        wx.request({
                          url: app.globalData.domain + `count/type/${app.globalData.userId}/${i}`,
                          data: {},
                          header: {
                            'content-type': 'json'
                          },
                          method: "GET",
                          success: function (res) {
                            let data = res.data.Data;
                            dataChart.push({
                              name: tags[i],
                              value: data
                            })
                            i++;
                            // 5
                            wx.request({
                              url: app.globalData.domain + `count/type/${app.globalData.userId}/${i}`,
                              data: {},
                              header: {
                                'content-type': 'json'
                              },
                              method: "GET",
                              success: function (res) {
                                let data = res.data.Data;
                                dataChart.push({
                                  name: tags[i],
                                  value: data
                                })
                                i++;
                                // 6
                                wx.request({
                                  url: app.globalData.domain + `count/type/${app.globalData.userId}/${i}`,
                                  data: {},
                                  header: {
                                    'content-type': 'json'
                                  },
                                  method: "GET",
                                  success: function (res) {
                                    let data = res.data.Data;
                                    dataChart.push({
                                      name: tags[i],
                                      value: data
                                    })
                                    i++;
                                    // 7
                                    wx.request({
                                      url: app.globalData.domain + `count/type/${app.globalData.userId}/${i}`,
                                      data: {},
                                      header: {
                                        'content-type': 'json'
                                      },
                                      method: "GET",
                                      success: function (res) {
                                        let data = res.data.Data;
                                        dataChart.push({
                                          name: tags[i],
                                          value: data
                                        })
                                        that.setChart(tags, dataChart, dataChartAll);
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
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
      success: function (res) {
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
      success: function (res) {
        let data = res.data.Data;
        that.setData({
          dreamList: data
        });
      }
    })
    // 次数统计
    wx.request({
      url: app.globalData.domain + `count/time`,
      data: {},
      header: {
        'content-type': 'json'
      },
      method: "GET",
      success: function (res) {
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
        // console.log(res.data.Data);
      }
    })
  },

  toDetail: function (val) {
    let id = val.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../../myCommunity/dreamArticle/dreamArticle?id=${id}`
    })
  },

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
    // this.login()
    var that = this;
    if (app.globalData.openId != '')
      that.setData({ openId: true })
    // console.log("?:", that.data.openId);
  },

  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
})