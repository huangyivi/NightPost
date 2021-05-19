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
    animationUp : null,
    animationDown : null
  },
  lifetimes :{
    ready : function() {
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
      this.setData({
        animationUp : null,
        animationDown : null
      })
      let up = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      up.translateY('-20rpx').opacity(0).opacity(1).step();
      
      let down = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease'
      })
      down.translateY('0').opacity(0).opacity(1).step();

      this.setData({
        animationUp : up.export(),
        animationDown : down.export()
      })
    }
  }
})
