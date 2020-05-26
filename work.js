var express = require('express');
var exec = require('child_process').execSync;
var socketIo = require("socket.io");
var http = require("http");
var util = require("./util");
var cors = require('cors');

const port = process.env.PORT || 3000

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

io.on("connection", socket => {
	console.log("new client connected");

	socket.on("incoming data", (data) => {
		socket.broadcast.emit("outgoing data", {
			num: data
		});
	});
	socket.on("incoming data-temperature", (data) => {
		socket.broadcast.emit("outgoing data-temperature", {
			num: data
		});
	});
	socket.on("go-incoming data", (data) => {
		socket.broadcast.emit("go-outging data", {
			num: data
		});
	});
	socket.on("disconnect", () => console.log("client disconnect"));
});

app.get('/', function(req, res) {
	var str = exec('python3 ~/AutoXueXi/dingding-come.py');
	var result = {};
	result.info = str.toString('utf8').trim();
	res.send(result);
});

app.get('/camera',function(req,res){
	console.log('camera')
	var str = exec('python3 ~/AutoXueXi/camera.py');
	var result = {};
	result.info = str.toString('utf8').trim();
	res.send(result);
});

app.get('/openAuto', function(req, res) {
	var str = exec('~/AutoXueXi/OpenAuto.sh');
	var result = {};
	result.info = str.toString('utf8').trim();
	res.send(result);
});

app.get('/closeAuto', function(req, res) {
	var str = exec('~/AutoXueXi/CloseAuto.sh');
	var result = {};
	result.info = str.toString('utf8').trim();
	res.send(result);
});

app.get("/go", function(req, res) {
	try {
		console.log("签退")
		var gocmdstr = "python3";
		util.run_cmd(gocmdstr, ['/root/AutoXueXi/dingding-go.py'], "go-incoming data", function() {});
		var result = {};
		result.info = "ok";
		res.send(result);
	} catch (e) {
		console.log(e);
	}
});

app.get("/come", function(req, res) {
	try {
		console.log("签到")
		var gocmdstr = "python3";
		util.run_cmd(gocmdstr, ['/root/AutoXueXi/dingding-come.py'], "go-incoming data", function() {});
		var result = {};
		result.info = "ok";
		res.send(result);
	} catch (e) {
		console.log(e);
	}
});

app.get("/autoCheck", function(req, res) {
	var str = exec('bash ~/AutoXueXi/AutoCheck.sh');
	var result = {};
	result.info = str.toString('utf8').trim();
	console.log(result);
	res.send(result);
});

app.get("/test",function(req,res){
	res.send("ok");
})

server.listen(port, function() {
	console.log('listening on port:%s', port);
})
