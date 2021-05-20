// 获取临时文件名称
const getFileName = function(file) {
  if(file) {
    let name = file.split('\/');
    return name[name.length - 1];
  }
  return '';
}

// 传入时间戳，格式化时间为：2021/01/01 12:00:00
const formatDate = (date) => {
  if(!date) return null;
  //date是传入的时间
  let d = new Date(date);

  let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
  let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  let min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  let sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();

  let times = d.getFullYear() + '/' + month + '/' + day + ' ' + hours + ':' + min + ':' + sec;

  return times;
}

// 请求后台的方法
const handleRequest = (params)=>{
  const domain = 'http://39.99.140.114';
  wx.showLoading({
    title: '加载中',
  })
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      url: domain + params.url,
      success:(res)=>resolve(res),
      fail: err=>reject(err),
      complete: ()=>{
        wx.hideLoading();
      }
    })
  })
}


module.exports = {
  getFileName,
  handleRequest,
}