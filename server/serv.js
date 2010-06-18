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
	url = require('url'),
	fs = require('fs'),
	chess = require('./chess'),
	path  = require('path');
	//process = require('process');
	//JSON = require('json');


var players		= new Array();// what players are active
var plays_with	= new Array();// who plays with who
var tables		= new Array();// current game tables





//this is exported by this module
exports.server = http.createServer(function (req, res) {

		sys.puts("just received a "+req.method+" request\n");
		//sys.puts(sys.p(req)+"\n");
		if(			req.method == 'OPTIONS') {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('test');
			//res.writeHead(200, {'Content-Length': 0});
		} else if ( req.method == 'POST') {
	
		} else if ( req.method == 'GET' ) {
				//a quick static HTTP file server
				//keeping things minimalistic, no apache, no nothing, just node.js

				var uri = url.parse(req.url).pathname;  

				sys.puts("uri =" +uri+"\n");

				var pieces = process.cwd().split("/");
				pieces.pop();

				var filename = path.join( pieces.join("/") + "/", uri);
				sys.puts("checking for file " + filename + "\n");

				path.exists(filename, 
					function(exists) {  
						if(!exists) {
							sys.puts("file does not exist\n");
							res.sendHeader(404, {"Content-Type": "text/plain"});  
							res.write("404 Not Found\n");  
							res.close();  
							return;  
						}  
					
						fs.readFile(filename, "binary", 
							function(err, file) {  
								if(err) {  
									res.sendHeader(500, {"Content-Type": "text/plain"});  
									res.write(err + "\n");  
									res.close();  
									return;  
								}  
								res.sendHeader(200);  
								res.write(file, "binary");  
								res.close();  
						});  
					});  
		} else {
		//everything else
		};



		});

// fire up a server
exports.server.listen(80, "127.0.0.1");

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
