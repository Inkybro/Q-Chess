

var sys   = require('sys'               ),
	http  = require('http'              ),
	url   = require('url'               ),
	fs    = require('fs'                ),
	faye  = require('../faye/faye-node' ),
	chess = require('./chess'           ),
	path  = require('path'              );

var fayeClient = new Faye.Client("http://localhost:8000/faye");


fayeClient.subscribe("/comet",function(msg){
		sys.puts(msg.data+"\n");
});
