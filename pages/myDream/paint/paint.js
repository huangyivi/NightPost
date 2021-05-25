const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    thick: 10,
    color: '#181818',
    // 是否使用橡皮擦
    isClear: false,
    // 是否显示调色板
    showColorPane: false,
  },
  canvasW: 0,
  canvasH: 0,
  startX: 0,
  startY: 0,
  lastImage: [],
  context: null,
  onReady: function () {
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function (e) {
        that.data.capsuleHeight = e.height;
      }
    })
    let canvas = wx.createSelectorQuery().select('#paint');
    canvas.boundingClientRect(function (rect) {
      that.canvasH = Math.ceil(rect.height);
      that.canvasW = Math.ceil(rect.width);
      // 如果有临时文件
      if (app.globalData.lastImage.length > 0) {
        that.lastImage = app.globalData.lastImage;
        that.recall();
      }
    }).exec()
    this.context = wx.createCanvasContext('paint', this);
  },
  //  保存画布
  savePaint() {
    let that = this;
    wx.canvasGetImageData({
      canvasId: 'paint',
      x: 0,
      y: 0,
      width: that.canvasW,
      height: that.canvasH,
      success(res) {
        that.lastImage.push(res.data);
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  touchStart(e) {
    this.savePaint();
    this.startX = e.touches[0].x;
    this.startY = e.touches[0].y;
    this.context.setLineCap('round');
    this.context.setLineJoin('round');
    this.context.setLineWidth(this.data.thick);
    if (this.data.isClear) {
      // 启用橡皮擦
      this.context.setStrokeStyle('#ffffff');
      this.context.save();
      this.context.beginPath(); // 开始路径
      this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true);
      this.context.fill();
      this.context.restore();
    } else {
      this.context.setStrokeStyle(this.data.color);
      this.context.beginPath();
    }
    this.context.moveTo(this.startX, this.startY);
  },
  touchMove(e) {
    let x1 = e.touches[0].x;
    let y1 = e.touches[0].y;
    this.context.lineTo(x1, y1);
    if (this.data.isClear) {
      this.context.save();
      this.context.stroke();
      this.context.restore();
    } else {
      this.context.stroke();
    }
    this.context.draw(true);
    this.context.moveTo(x1, y1);
  },
  touchEnd(e) {

  },
  changeThickness(e) {
    this.setData({
      thick: e.target.dataset.thick
    })
  },
  changeColor(e) {
    this.setData({
      color: e.target.dataset.color,
      showColorPane: false
    })
  },
  getEraser() {
    this.data.isClear = !this.data.isClear;
    this.setData({
      isClear: this.data.isClear
    })
  },
  showPane() {
    this.data.showColorPane = !this.data.showColorPane;
    this.setData({
      showColorPane: this.data.showColorPane
    })
  },
  // 撤回操作
  recall() {
    let that = this;
    console.log(that);
    wx.canvasPutImageData({
      canvasId: 'paint',
      data: that.lastImage[that.lastImage.length - 1],
      height: that.canvasH,
      width: that.canvasW,
      x: 0,
      y: 0,
      success() {
        that.lastImage.pop();
      },
      fail(err) {
        console.log(err);
      }
    }, this)
  },
  // 重新做
  redo() {
    let that = this;
    wx.showModal({
      content: '确定要重新绘制吗？',
      cancelText: "取消",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          that.lastImage = [];
          app.globalData.imageFile = '';
          app.globalData.lastImage = [];
          that.context.rect(0, 0, that.canvasW, that.canvasH);
          that.context.setFillStyle('#ffffff');
          that.context.fill();
          that.context.draw();
        }
      }
    })
  },
  // 完成
  upload() {
    this.savePaint();
    let that = this;
    wx.showModal({
      content: "大作已经完成了吗？",
      confirmText: "是的",
      cancelText: "还没",
      success(res) {
        if (res.confirm) {
          app.globalData.lastImage = that.lastImage;
          wx.canvasToTempFilePath({
            canvasId: 'paint',
            x: 0,
            y: 0,
            fileType: 'jpg',
            width: that.canvasW,
            height: that.canvasH,
            destHeight: that.canvasH,
            destWidth: that.canvasW,
            success(res) {
              app.globalData.imageFile = res.tempFilePath;
              wx.navigateBack();
            }
          })
        }
      }
    })
  },
  // 返回
  return () {
    let that = this;
    wx.showModal({
      content: '确定要返回吗？',
      confirmText: "确定",
      cancelText: "取消",
      success(res) {
        if(res.confirm) {
          that.savePaint();
          wx.navigateBack()
        }
      }
    })
    
  },

})