const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    capsuleHeight: 44,
    tags: ["爱情","玄幻","怪诞"],
    tagIndex: 0,
    list:[
      {
        title: "梦的标题",
        tag:"爱情",
        date: "今日",
        star: 94
      },
      {
        title: "梦的标题",
        tag:"爱情",
        date: "今日",
        star: 99
      },
      {
        title: "梦的标题",
        tag:"爱情",
        date: "今日",
        star: 43
      },
      {
        title: "梦的标题",
        tag:"爱情",
        date: "今日",
        star: 95
      },
    ]
  },
  onReady: function(){
    let that = this;
    wx.getMenuButtonBoundingClientRect({
      success: function(e){
        that.data.capsuleHeight = e.height;
      }
    })
  },
  onLoad:function(){
    // 处理一下数据
    let list = this.data.list.map((item,index)=>{
      return {
        ...item,
        url:this.getDreamURL(index)
      }
    });
    this.setData({list});
  },
  // 选择标签
  handleChangeTag(e){
    this.setData({
      tagIndex: e.detail.value
    })
  },
  // 获取梦境地址
  getDreamURL(id){
    return `../dreamArticle/dreamArticle?id=${id}`;
  },
  // 排序
  handleSort(){
    console.log('sort');
    let list = this.data.list.sort((a,b)=>b.star-a.star);
    this.setData({list})
  }
})