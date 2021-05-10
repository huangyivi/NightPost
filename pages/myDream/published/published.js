const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    animationData : null,
    hasEgg : true,
    eggCtx: ' 梦见养羊，预示着你近期的运势很好，路上将会遇到自己很久没见的故人，两人有很多说不完的话。找工作者梦见养羊，预示着你近期的求职运势很好，自己的表现得到考官的欣赏，有机会获得一份好的工作。务员梦见养羊，预示着你近期的运势很好，自己的表现太好，得到上司的器重，有机会可以升职。找工作者梦见养羊，预示着你近期的求职运势很好，自己的表现得到考官的欣赏，有机会获得一份好的工作。公务员梦见养羊，预示着你近期的运势很好，自己的表现太好，得到上司的器重，有机会可以升职。找工作者梦见养羊，预示着你近期的求职运势很好，自己的表现得到考官的欣赏，有机会获得一份好的工作。公务员梦见养羊，预示着你近期的运势很好，自己的表现太好，得到上司的器重，有机会可以升职。'
  },
  onReady: function(){
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function(e){
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onShow() {
    let move = wx.createAnimation({
      duration: 3000,
      timingFunction: "ease"
    })
    move.opacity(1).step();
    this.setData({
      animationData : move.export()
    })
  },
  return(){
    wx.navigateBack();
  },
})