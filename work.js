var express = require('express');
var exec = require('child_process').execSync;
var socketIo = require("socket.io");
var http = require("http");
var util = require("./util");
var cors = require('cors');

const port = process.env.PORT || 3001

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const ssh = "ssh -i ~/pri_98.pem -p 6000 root@111.67.194.35";

app.use(cors());

io.on("connection", socket => {
	console.log("new client connected");

	socket.on("incoming data", (data) => {
		socket.broadcast.emit("outgoing data", {
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
	var str = exec(ssh + " 'python3 ~/AutoXueXi/dingding-come.py'");
	var result = {};
	result.info = str.toString('utf8').trim();
	res.send(result);
});

app.get('/openAuto', function(req, res) {
	var str = exec(ssh + " '~/AutoXueXi/OpenAuto.sh'");
	var result = {};
	result.info = str.toString('utf8').trim();
	res.send(result);
});

app.get('/closeAuto', function(req, res) {
	var str = exec(ssh + " '~/AutoXueXi/CloseAuto.sh'");
	var result = {};
	result.info = str.toString('utf8').trim();
	res.send(result);
});

app.get("/go", function(req, res) {
	try {
		var gocmdstr = "ssh";
		util.run_cmd(gocmdstr, ['-i', '~/pri_98.pem', '-p', '6000', 'root@111.67.194.35', 'python3 ~/AutoXueXi/dingding-go.py'], "go-incoming data", function() {});
		var result = {};
		result.info = "ok";
		res.send(result);
	} catch (e) {
		console.log(e);
	}
});

app.get("/come", function(req, res) {
	try {
		var gocmdstr = "ssh";
		util.run_cmd(gocmdstr, ['-i', '~/pri_98.pem', '-p', '6000', 'root@111.67.194.35', 'python3 ~/AutoXueXi/dingding-come.py'], "go-incoming data", function() {});
		var result = {};
		result.info = "ok";
		res.send(result);
	} catch (e) {
		console.log(e);
	}
});

app.get("/autoCheck", function(req, res) {
	var str = exec(ssh + " 'bash ~/AutoXueXi/AutoCheck.sh'");
	var result = {};
	result.info = str.toString('utf8').trim();
	console.log(result);
	res.send(result);
});

server.listen(port, function() {
	console.log('listening on port:%s', port);
})
