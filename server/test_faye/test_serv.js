
var sys   = require('sys'               ),
	http  = require('http'              ),
	url   = require('url'               ),
	fs    = require('fs'                ),
	faye  = require('faye' ),
	path  = require('path'              );
	//process = require('process');


var fayeServer = new faye.NodeAdapter({
    mount:    '/comet',
    timeout:  45
});

var fayeClient = null;

var cnt = 0;// count of the messages sent on the channel


setInterval(
		function(){ 
		    if(!fayeClient)
				return;
		    
		    sys.puts(++cnt + " just published another message on channel \"comet\"\n");
			fayeClient.publish(
				"/somechannel",
				{
					data: "yeah"+cnt
				}
			);
		},
		1000
);




var server = http.createServer(function (req, res) {
		sys.puts("check this out, I've received a request\n");
});

fayeClient = new faye.Client("http://localhost/somechannel");

fayeServer.attach(server);

server.listen(80,"localhost");
