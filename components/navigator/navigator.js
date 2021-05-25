// components/navigator.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    role: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData : null
  },
  pageLifetimes :{
    show : function() {
      this.loadAnimation();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      this.loadAnimation()
      let site = e.target.dataset.site;
      if(site == 0) {
        wx.switchTab({
          url: '../../../pages/myCommunity/listView/listView'
        })
      }else if(site == 1) {
        wx.switchTab({
          url: '../../../pages/myDream/editDream/editDream'
        })
      }else if(site == 2){
        wx.switchTab({
          url: '../../../pages/mySelf/aboutMe/aboutMe'
        })
      }
    },
    loadAnimation() {
      let up = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease'
      })
      up.translateY('-20rpx').step();
      
      let down = wx.createAnimation({
        duration: 1500,
        timingFunction: 'ease'
      })
      down.translateY('0rpx').step();

      this.setData({
        animationData : up.export()
      })
      let that = this;
      setTimeout(function() {
        that.setData({
          animationData : down.export()
        })
      },1000)
    }
  }
})
