var sys   = require('sys'               ),
	http  = require('http'              ),
	url   = require('url'               ),
	fs    = require('fs'                ),
	faye  = require('faye' ),
	path  = require('path'              );

var fayeClient = new faye.Client("http://localhost:80/comet");


fayeClient.subscribe("/somechannel",function(msg){
		sys.puts("received\n");
		sys.puts(msg.data+"\n");
});
