var sys   = require('sys'               ),
	http  = require('http'              ),
	url   = require('url'               ),
	fs    = require('fs'                ),
	faye  = require('faye' ),
	path  = require('path'              );

var fayeClient = new faye.Client("http://localhost/comet");


fayeClient.subscribe("/somechannel",function(msg){
		sys.puts(msg.data+"\n");
});
