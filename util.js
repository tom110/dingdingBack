let socket = require("socket.io-client")('http://127.0.0.1:3001');

function run_cmd(cmd,args,infoFlag, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd,args);
    var resp = "end";

    child.stdout.on('data', function (buffer) {
			console.log(buffer.toString());
      socket.emit(infoFlag,buffer.toString());
    });
    child.stdout.on('end', function() { callBack (resp) });
}

module.exports={
	run_cmd
}
