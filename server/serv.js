/*
 * http://github.com/wsdookadr
 *
 * chess server
 *
 * JSON will be used
 *
 * TODO: establish what kind of messages it will receive,
 *		 how to persist the data, and where to store it,
 *		 what actions are taken based on each type of message.
 *
 *	dependencies:
 *
 *		Node.js
 *
 */


var sys = require('sys'),
	http = require('http'),
	chess = require('./chess');
	//process = require('process');
	//JSON = require('json');


var players		= new Array();// what players are active
var plays_with	= new Array();// who plays with who
var tables		= new Array();// current game tables





//this is exported by this module
exports.server = http.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Hello World\n');
		sys.puts("just received a request\n");
		sys.puts(sys.p(req)+"\n");
		});

// fire up a server
exports.server.listen(8124, "127.0.0.1");

sys.puts("started a server");



//serializer
JSON.stringify = JSON.stringify || function (obj) {  
	var t = typeof (obj);  
	if (t != "object" || obj === null) {  
		// simple data type  
		if (t == "string") obj = '"'+obj+'"';  
		return String(obj);  
	}  
	else {  
		// recurse array or object  
		var n, v, json = [], arr = (obj && obj.constructor == Array);  
		for (n in obj) {  
			v = obj[n]; t = typeof(v);  
			if (t == "string") v = '"'+v+'"';  
			else if (t == "object" && v !== null) v = JSON.stringify(v);  
			json.push((arr ? "" : '"' + n + '":') + String(v));  
		}  
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");  
	}  
};  

//sys.puts('Server running at http://127.0.0.1:8124/');
