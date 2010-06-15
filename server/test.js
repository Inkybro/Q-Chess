
var sys           = require('sys'    ) ,
	assert        = require('assert' ) ,
	http          = require('http'   ) ,
	serv          = require('./serv' ) ,
	callbackFired = false;

//sys.p(serv);
serv.server.listen(8124);

//serv;

/*
http
.cat('http://localhost:3000/')
.addCallback(function(data) {
		callbackFired = true;
		assert.equal('hello world', data);
		hello.server.close();
		});

process.addListener('exit', function() {
		assert.ok(callbackFired);
		});
		*/
