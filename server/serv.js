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


var players		= new Array();// what players are active
var plays_with	= new Array();// who plays with who
var tables		= new Array();// current game tables

var last_player_id = 0;


var config;//qooxdoo config file(will contain address to node.js server)





//this is exported by this module
exports.server = http.createServer(function (req, res) {
		var data = "";//the data sent through the request to the server
		req.addListener('data', function (chunk) {
			data+=chunk;
		});


		sys.puts("just received a "+req.method+" request\n");
		//sys.puts(sys.p(req)+"\n");
		if(			req.method == 'OPTIONS') {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('server not setup properly');
			//res.writeHead(200, {'Content-Length': 0});
		} else if ( req.method == 'POST') {


			req.addListener('end', function () {
				sys.puts(data);
				sys.puts("before\n");
				data = JSON.parse(data);
				var id = data.player_id;
				sys.puts("the id="+id+"\n");
				//sys.puts(sys.p(players[id])+"\n");


				var right_table = tables[id];
				if(right_table) {
					/*
					 * check the move to see if it's legal , if it is , make the move
					 * persist, otherwise tell the client it's not where it's at.
					 *
					 */

					res.writeHead(200, {'Content-Type': 'text/plain'});

					if(right_table.legal_move(data.startpos , data.endpos)) {
						right_table.move(data.startpos , data.endpos);
						res.end( 
							JSON.stringify( {move_okay: 1,})
							);
					}else {
						res.end( 
							JSON.stringify( {move_okay: 0,})
							);
					};

				} else
					sys.puts("table for player with id "+id+" does not exist");

			});

		} else if ( req.method == 'GET' ) {
				//a quick static HTTP file server(will serve the needed qooxdoo files)
				//keeping things minimalistic, no apache, no nothing, just node.js

				var uri = url.parse(req.url).pathname;  


				var params = url.parse(req.url,true);//params for GET request in params.query
				//sys.puts(sys.p(params)+"\n"); // to display parameters of GET
				if(params && 
				   params.query && 
				   params.query['messagetype'] == 'newuser' ) {
					sys.puts("new user message\n");
					
					res.writeHead(200, {'Content-Type': 'application/json'});

					var newid = ++last_player_id;
					res.end(
							JSON.stringify(
									{ id: newid } 
								)
							);// send him a new id(maybe should be random?)
					tables[newid] = new chess.Table();
					players[newid] = true;
					//sys.puts(sys.p(players[newid]));
					return;
				};



				var pieces = process.cwd().split("/");
				pieces.pop(); //pop current directory, need parent
				var filename = path.join( pieces.join("/") + "/", uri);
				//sys.puts("uri =" +uri+"\n");
				//sys.puts("checking for file " + filename + "\n");
				// if the file exists 200 and serve it, otherwise 404 or 500
				path.exists(filename, 
					function(exists) {  
						if(!exists) {
							/* the file does not exist so maybe it's not a request for a file */
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

fs.readFile('../config.json', function (err, data) {
		if (err) 
			throw err;
		//sys.puts(data);

			// cut off comments and parse JSON 
			data = data.toString();
			data = data.replace(/\/\/.*/gi,"");
			data = data.replace(/\/\*[^*]+\*\//gm,"");

			config = JSON.parse(data.toString());
			exports.server.listen(80,config.server_url);//fire up server
			sys.puts("started a server");
		});


//exports.server.listen(80, "127.0.0.1");//loopback, can't be accessed from other machines


