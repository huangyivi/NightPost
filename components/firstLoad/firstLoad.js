// components/firstLoad/firstLoad.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: null,
    showAndHide: null,
    fromLeft: null,
    fromRight: null,
    show: null,
    isShow: true
  },

  pageLifetimes: {
    show: function () {
      this.loadAnimation()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadAnimation() {
      let that = this;
      // 图片出现
      let showAndHide = wx.createAnimation({
        duration: 1200,
        timingFunction: 'ease'
      })
      showAndHide.opacity(1).step();
      that.setData({
        showAndHide: showAndHide.export()
      })

      // 文字拼接
      let left = wx.createAnimation({
        duration : 1000,
        timingFunction: "linear"
      })
      let right = wx.createAnimation({
        duration : 1000,
        timingFunction: "linear"
      })
      let show = wx.createAnimation({
        duration : 1000,
        timingFunction: "ease"
      })
      left.translateX(0) .opacity(1).step();
      right.translateX(0).opacity(1).step();
      show.opacity(1).step();
      setTimeout(() => {
        that.setData({
          fromLeft : left.export(),
          fromRight : right.export(),
          show : show.export()
        })
      }, 1200);

      // 黑底消失
      let hide = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      hide.opacity(0).step();

      setTimeout(function () {
        that.setData({
          animationData: hide.export()
        })
      }, 4000)

      // 首屏隐藏
      setTimeout(function () {
        that.setData({
          isShow: false
        })
      }, 5000);
    }
  }
})