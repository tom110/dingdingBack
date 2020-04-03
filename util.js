let socket = require("socket.io-client")('http://127.0.0.1:3001');

function run_cmd(cmd,args,infoFlag, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd,args);
    var resp = "end";

    child.stdout.on('data', (buffer) => {
      console.log('------');
			console.log(buffer.toString('utf8'));
      socket.emit(infoFlag,buffer.toString());
    });

    child.stderr.on('data',(data) => {
      console.error(`ps stderr: ${data}`);
      socket.emit(infoFlag,`ps stderr: ${data}`)
    });

    child.stdout.on('end', function() { callBack (resp) });
}

module.exports={
	run_cmd
}
