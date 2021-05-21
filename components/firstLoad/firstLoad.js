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
      console.log('触发首屏动画');
      let hide = wx.createAnimation({
        duration: 3000,
        timingFunction: 'ease-out'
      })

      hide.opacity(0).translateY('-200rpx').step();
      this.setData({
        animationData: hide.export()
      })

      let that = this;
      setTimeout(function () {
        that.setData({
          isShow: false
        })
      },3000)
    }
  }
})