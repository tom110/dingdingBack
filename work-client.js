var exec=require('child_process').execSync;
let socket = require("socket.io-client")('http://127.0.0.1:3000');

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function valiteConnection(str){
	//console.log(typeof(str) == "undefined");
	if(typeof(str) == "undefined"){
		console.log((new Date()).format("yyyy-MM-dd hh:mm:ss.S"));
		exec("adb connect 127.0.0.1");
	}
}

setInterval(function(){
	try{
  var str=exec("adb shell dumpsys battery | sed -n \"8,8p\" | awk \"{print $2}\"");
	str= str.toString().split(":")[1];
	valiteConnection(str);
  socket.emit('incoming data', parseInt(str));
	}catch(e){
		console.log(e);
		socket.emit("incoming data",0);
	}
},5000);

//温度查询
setInterval(function(){
	try{
  var str=exec("adb shell dumpsys battery | sed -n \"11,11p\" | awk \"{print $2}\"");
	str= str.toString().split(":")[1];
	valiteConnection(str);
  socket.emit('incoming data-temperature', parseFloat(str)/10);
	}catch(e){
		console.log(e);
		socket.emit("incoming data",0.0);
	}
},5000);
