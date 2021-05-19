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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    rdctTo(e) {
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
    }
  }
})
