// 获取临时文件名称
const getFileName = function(file) {
  if(file) {
    let name = file.split('\/');
    return name[name.length - 1];
  }
  return '';
}

// 传入时间戳，格式化时间
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

module.exports = {
  getFileName
}