import {
  handleRequest
} from "../../../utils/util";

const app = getApp();
const TIME = true;
const APPROVE = false;

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    tags: ['美梦', '噩梦', '白日梦', '预知', '猎奇', '反梦', '平平淡淡', '其他'],
    tagIndex: -1,
    list: [
      // {
      //   title: "梦的标题",
      //   tag:"爱情",
      //   date: "今日",
      //   star: 95
      // },
    ],
    type: true, // true - 时间, false - 点赞
  },
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onLoad: function () {
    // 一开始进来根据时间排序
    this.getDreamByWhat(TIME);
  },

  // 选择标签
  handleChangeTag(e) {
    let index = e.detail.value;
    handleRequest({
      url: '/dream/bytype/' + (parseInt(index) + 1),
      methods: 'get'
    }).then(result => {

      const {
        data: res
      } = result;

      if (!res.Status) return;

      //  处理数据
      let list = res.Data.map((item, index) => {
        return {
          ...item,
          url: this.getDreamURL(item),
          Type: this.getDreamType(item.type)
        }
      });

      this.setGlobalDream(list);

      this.setData({
        tagIndex: index,
        list
      })

    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '服务器连接失败',
        icon: 'error'
      })
    })
  },

  // 排序
  handleSort() {
    let {
      type
    } = this.data;
    if (type) {
      this.getDreamByWhat(APPROVE);
    } else {
      this.getDreamByWhat(TIME);
    }
    this.setData({
      type: !type
    });
  },

  // 根据点赞或时间获取梦境 true - 时间 ，false - 点赞
  getDreamByWhat(status){
    handleRequest({
      url: status?"/dream/bytime":"/dream/like/dream",
      methods: 'get'
    }).then(result => {
      console.log(result);
      const {
        data: res
      } = result;
      if (!res.Status) return;

      // 成功后处理一下数据
      let list = res.Data.map((item, index) => {
        return {
          ...item,
          url: this.getDreamURL(item),
          Type: this.getDreamType(item.type)
        }
      });

      // 改变全局梦境列表
      this.setGlobalDream(list);

      this.setData({
        list
      });
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '服务器连接失败',
        icon: 'error'
      })
    })
  },

  // 点击去详情页面
  handleTo(e) {
    const {
      index
    } = e.target.dataset;
    app.globalData.currentIndex = parseInt(index);
    console.log(app.globalData.currentIndex);
  },

  // 获取梦境地址
  getDreamURL(dream) {
    dream.Type = this.getDreamType(dream.type);
    return `../dreamArticle/dreamArticle?dream=${JSON.stringify(dream)}`;
  },

  // 获取梦类型
  getDreamType(type) {
    return this.data.tags[parseInt(type) - 1];
  },

  // 设置全局变量dreamlist
  setGlobalDream(dream){
    app.globalData.dreamsList = dream;
  }
})