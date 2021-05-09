const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    thick: 10,
    color: '#000000'
  },
  startX : 0,
  startY : 0,
  // 是否使用橡皮擦
  isClear: false,
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
  },
  touchStart(e){
    this.startX = e.touches[0].x;
    this.startY = e.touches[0].y;
    this.context = wx.createCanvasContext('paint',this);
    this.context.setLineCap('round');
    this.context.setLineJoin('round');
    this.context.setLineWidth(this.data.thick);
    console.log(this.context);
    if(this.isClear) {
      // 启用橡皮擦
      this.context.setStrokeStyle('#ffffff');
      this.context.save();
      this.context.beginPath();// 开始路径
      this.context.arc(this.startX,this.startY,5,0,2*Math.PI,true);
      this.context.fill();
      this.context.restore();
    }else {
      this.context.setStrokeStyle(this.data.color);
      this.context.beginPath();
    }
    this.context.moveTo(this.startX,this.startY);
  },
  touchMove(e){
    let x1 = e.touches[0].x;
    let y1 = e.touches[0].y;
    this.context.lineTo(x1,y1);
    if(this.isClear) {
      this.context.save();
      this.context.stroke();
      this.context.restore();
    }else {
      this.context.stroke();
    }
    this.context.draw(true);
    this.context.moveTo(x1,y1);
  },
  touchEnd(e) {

  },
  return () {
    wx.navigateBack();
  },
  changeThickness(e) {
    this.setData({
      thick: e.target.dataset.thick
    })
  },
  changeColor(e) {
    this.setData({
      color : e.target.dataset.color
    })
  },
  getEraser() {
    this.isClear = !this.isClear;
  }

})