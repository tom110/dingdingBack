var exec=require('child_process').execSync;
let socket = require("socket.io-client")('http://127.0.0.1:3001');


setInterval(function(){
	try{
  var str=exec("adb shell dumpsys battery | sed -n \"8,8p\" | awk \"{print $2}\"");
	str= str.toString().split(":")[1];
  socket.emit('incoming data', parseInt(str));
	}catch(e){
		console.log(e);
		socket.emit("incoming data",0);
	}
},5000);

//温度查询
try{
var str=exec("adb shell dumpsys battery | sed -n \"11,11p\" | awk \"{print $2}\"");
str= str.toString().split(":")[1];
socket.emit('incoming data-temperature', parseFloat(str)/10);
}catch(e){
	console.log(e);
	socket.emit("incoming data",0);
}
setInterval(function(){
	try{
  var str=exec("adb shell dumpsys battery | sed -n \"11,11p\" | awk \"{print $2}\"");
	str= str.toString().split(":")[1];
  socket.emit('incoming data-temperature', parseFloat(str)/10);
	}catch(e){
		console.log(e);
		socket.emit("incoming data",0);
	}
},10000);