
var sys   = require('sys'               ),
	http  = require('http'              ),
	url   = require('url'               ),
	fs    = require('fs'                ),
	faye  = require('../faye/faye-node' ),
	chess = require('./chess'           ),
	path  = require('path'              );
	//process = require('process');


var fayeClient = new Faye.Client("http://127.0.0.1:8000/faye");

var fayeServer = new Faye.NodeAdapter({
    mount:    '/comet',
    timeout:  45
});


var cnt = 0;// count of the messages sent on the channel


setInterval(
		function(){ 
		    
		    sys.puts(++cnt + " just published another message on channel \"comet\"\n");
			fayeClient.publish("/comet",
				{
					data: "yeah"+cnt
				}
			);
		},
		1000
);




var server = http.createServer(function (req, res) {
        if (fayeServer.call(req, res)) 
            return;

});

server.listen(80,"127.0.0.1");
