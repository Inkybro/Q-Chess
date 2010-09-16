/*
 * http://github.com/wsdookadr
 *
 * chess server
 *
 * JSON will be used
 *
 * TODO: establish what kind of messages it will receive,
 *         how to persist the data, and where to store it,
 *         what actions are taken based on each type of message.
 *
 *    dependencies:
 *
 *        Node.js
 *
 */



var sys   = require('sys'               ),
    http  = require('http'              ),
    url   = require('url'               ),
    fs    = require('fs'                ),
    faye  = require('faye' ),
    chess = require('./chess'           ),
    path  = require('path'              );
    //process = require('process');


var server_url = "";
var players        = new Array();
var ping_timeout = 15;//seconds after which disconnect if no ping
var config;//qooxdoo config file(will contain address to node.js server)


/*
 * Players
 * -------
 *
 * players[name] = {
 *		lastping:  Date object,        // <-- the last ping we got from this player
 *      table:     chess.Table object, // <-- the current state of the table for this player
 *      requests:  Array               // <-- requests from the following players have been made for a game
 *      plays_with: String             // <-- name of the player with whom he plays
 * };
 *
 * if players[name] is undefined then that slot is free for a new player
 *
 * 
 *
 *
 * Messages
 * --------
 *
 *  Name of message is passed as parameter "messagetype"
 *
 * 
 *  [match_start]
 *  verb: POST
 *  params: player1,player2
 *  meaning: player1 sent a request to start a match with player2
 *
 *  [ping]
 *  verb: POST
 *  params: name
 *  meaning: a player sends a ping to the server to remind him he's still active
 *
 *  [newmove]
 *  verb: POST
 *  params: id, startpos, endpos
 *  meaning: a player with name params.id tells the server that 
 *           he just made the move params.startpos -> params.endpos
 *           server will tell the player if the move was legal or not through the response.
 *           both startpos,endpos are arrays of the form [x,y].
 *  response: { move_okay: 0|1 }
 *            
 * 
 *  [get_players_list]
 *  verb: GET
 *  params:
 *  meaning: a player asks for the list of players currently connected to the server
 *  response: { names: [player name strings] }
 *  
 *  [newuser]
 *  verb: GET
 *  params: name
 *  meaning: a new user has connected to the server, if his name is not already taken
 *           the server will create a new entry in the players array for him.
 *  response:  {
 *                messagetype: "error", 
 *                description: "name already registered"
 *             }
 *
 *             or
 *
 *             {
 *                registered: "yes"
 *             }
 *  
 *  [requestMatch]
 *
 *   \\TODO 
 *  
 *  [acceptRequest]
 *
 *   \\TODO
 *  
 *
 *
 */









var fayeServer = new faye.NodeAdapter({
    mount:    '/comet',
    timeout:  45
});


var client = null;



function disconnectPlayer(name) {

    sys.puts("player "+name+" was disconnected(ping timeout) ");




    if(players[name].plays_with) {
        //TODO
        //send a message through Comet to -> players[name].plays_with
        //telling him that the other player left
    };

	client.publish("/channel",{
			 sender: "Server",
             type: "lostPlayerConnection",
			 name: name
	});

    delete players[name];

    // notify other player that his mate left
    // TODO: cleaning up lastping,ids,players,tables
    // post-condition: after this , all arrays with names or ids should be null or undefined for that player id/name
};







function checkPlayersAlive() {
    var rightNow = new Date();
    //sys.puts("running checkPlayersAlive()\n");
    for(name in players)
        if(rightNow.getTime() - players[name].lastping.getTime() > 1000*ping_timeout)
            disconnectPlayer(name);

    /*
    var p_names = new Array();//player names
    for(name in players)
        p_names.push(name);
    sys.puts(JSON.stringify(
                    { names: p_names } 
                )+"\n"
            );
    */


};






function getPlayersList(res) {
    sys.puts("get players list message\n");

    var p_names = new Array();//player names
    for(name in players)
        p_names.push(name);

    sys.puts(JSON.stringify(
                    { names: p_names } 
                )+"\n"
            );

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
            JSON.stringify(
                    { names: p_names } 
                )
            );
};








function errorMessage(message,res) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(
            JSON.stringify(
                    { 
                        messagetype: "error",
                        description: message
                    } 
                )
            );   
};







function newUser(res,params) {
    sys.puts("new user message\n");
    sys.puts("name: "+params.query['name']+"\n");

    if(
            params.query['name'] &&
            players[params.query['name']]
      ){ 
            errorMessage("name already registered",res);
            return;
       };

    players[params.query['name']] = 
         {
             lastping: new Date(),
             table:  new chess.Table(),
             requests: new Array,
             plays_with: null
         };

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
            JSON.stringify(
                    {  
                        registered: "yes"
                    } 
                )
           );// send him a code also ? (nonce ?)
};









function newMove(res,data) {
    var id = data.player_id;
    sys.puts("the id="+id+"\n");
    //sys.puts(sys.p(players[id])+"\n");

    if(!players[id]) {
        errorMessage("name not registered",res);
        return;
    };


    var right_table = players[id].table;
    if(right_table) {
        /*
         * check the move to see if it's legal , if it is , make the move
         * persist, otherwise tell the client it's not where it's at.
         *
         */

        res.writeHead(200, {'Content-Type': 'application/json'});

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
        sys.puts("table for player with name "+id+" does not exist");
};





function checkPlayer(name,res) {
    if(!players[name]) {
        errorMessage("player "+name+" is not registered",res);
        return false;
    };

    return true;
};



function requestMatch(data,res) {
    //data.player1 requests a match with data.player2

    var p1 = data.player1;
    var p2 = data.player2;

    if(!(checkPlayer(p1,res) && checkPlayer(p2,res))) {
        return;
    };

    if(players[p2].plays_with) {
        //non-null means (s)he is playing with someone
        errorMessage("already playing with someone",res);
        return;
    };

    players[p2].requests.push(p1);

	client.publish("/playerChannel/"+p2,{
			 sender: "Server",
             type: "requestMatch",
			 name: p1
	});

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end( 
            JSON.stringify( {request_ok: 1})
           );
};


function meltTables(p1,p2){
    delete players[p1].table;

    players[p1].table = players[p2].table;
    //p1 and p2 have the table
    
    players[p1].plays_with = p2;
    players[p2].plays_with = p1;
    //they are playing with eachother

    sys.puts("now "+p1+" will play with "+p2);
};

function acceptRequest(data,res) {
    if(!(checkPlayer(data.player,res)&&
         checkPlayer(data.requester,res)))
        return;

    if(players[data.player].plays_with) {
        errorMessage("already playing with someone",res);
        return;
    };

    //TODO: IMPORTANT !!! check data.requester is really in players[data.player].requests array

    meltTables(data.player,data.requester);


    //forget the requests to play from other players since these two are playing together now
    data.player.requests = new Array;
    data.requester.requests = new Array;

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end( 
            JSON.stringify( {request_ok: 1})
           );
    
	client.publish("/playerChannel/"+data.requester,{
			 sender: "Server",
             type: "acceptRequest",
			 name: data.player
	});

};

//this is exported by this module
exports.server = http.createServer(function (req, res) {
        //if (fayeServer.call(req, res)) // <-- treating comet messages
            //return;

        var data = "";//the data sent through the request to the server
        req.addListener('data', function (chunk) {
            data+=chunk;
        });


        sys.puts("just received a "+req.method+" request\n");
        //sys.puts(sys.p(req)+"\n");
        if(            req.method == 'OPTIONS') {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Server NOT set up properly!! (OPTIONS request was received)');
            //res.writeHead(200, {'Content-Length': 0});
        } else if ( req.method == 'POST') {


            req.addListener('end', function () {
                sys.puts(data);
                sys.puts("before\n");

                data = JSON.parse(data);

                switch(data.messagetype) {
                    case "requestMatch":
                        requestMatch(data,res);
                        break;
                    case "acceptRequest":
                        acceptRequest(data,res);
                        break;
                    case "newmove":
                        newMove(res,data);
                        break;
                    case "ping":
                        sys.puts("just got a ping from"+data.name);
                        
                        if(!players[data.name]) {
                            sys.puts("ping request received from a player that does not exist");
                            errorMessage("no such user",res);
                            return;
                        };

                        players[data.name].lastping = new Date();
                        //checkPlayersAlive();//TODO: find a better place for this, atm executed too often..
                        break;
                    default:;
                };

            });

        } else if ( req.method == 'GET' ) {
                    //a quick static HTTP file server(will serve the needed qooxdoo files)
                    //keeping things minimalistic, no apache, no nothing, just node.js

                    var uri = url.parse(req.url).pathname;  

                    var params = url.parse(req.url,true);//params for GET request in params.query
                    //sys.puts(sys.p(params)+"\n"); // to display parameters of GET
                    if(
                       params && 
                       params.query
                      ) {
                        switch(params.query['messagetype']){
                            case "newuser":
                                newUser(res,params);
								//client.publish({
								//});
                                return;
                            case "get_players_list":
                                getPlayersList(res);
                                break;
                            default:
								if(params.query['messagetype']) {
									sys.puts(
											"WARNING -> client sent messagetype \""+
											params.query['messagetype']+
											"\" not implemented by server "
											);
									return;
								};
                        };
                    };






                    var path_pieces = process.cwd().split("/");
                    path_pieces.pop(); //pop current directory, need parent

                    var filename = path.join( path_pieces.join("/"), uri);
                    //sys.puts("uri =" +uri+"\n");
                    // if the file exists 200 and serve it, otherwise 404 or 500
                    path.exists(filename, 
                        function(exists) {  
                            if(!exists) {
                                /* the file does not exist so maybe it's not a request for a file */

                                sys.puts("checking for file " + filename + "\n");
                                sys.puts("file does not exist\n");

                                process.exit(0);// <-- just for development to see quickly what went wrong

                                res.writeHead(404, {"Content-Type": "text/plain"});  
                                res.write("404 Not Found\n");  
                                res.end();  

                                return;  
                            };


                            /*
                            
                            // This piece sees if a file is a directory and if so lists the files/dirs inside it
                            // (just like Apache)

                            var wasDirectory = false;

                            fs.stat(filename,function(err,stats) {
                                    if(stats.isDirectory()) {
                                        fs.readdir(filename,function(err,files) {
                                            var dirListing = "";
                                                for(i in files)
                                                    dirListing += 
                                                        files[i]+"\n";
                                                    res.writeHead(404, {"Content-Type": "text/html"});  

                                                    res.write(
                                                        "<html><body>"+
                                                        "<h2>"+filename+"</h2>"+
                                                        "<pre>"+dirListing+"</pre>"+
                                                        "</body></html>"
                                                        );
                                                    res.end();
                                                    wasDirectory = true;
                                            });
                                    };
                            });

                            if(wasDirectory)
                                return;

                            */
                        
                            
                            fs.readFile(
                                filename, 
                                "binary", 
                                function(err, file) {  
                                        if(err) {  
                                            res.writeHead(500, {"Content-Type": "text/plain"});  
                                            res.write(err + "\n");  
                                            res.end();  
                                            return;  
                                        }  
                                        res.writeHead(200);  
                                        res.write(file, "binary");  
                                        res.end();
                                    }
                            );  
                        });  
            } else {
            //everything else(other requests than POST and GET)
            };

        });


/*
 * server_url is stored in config.json
 *
 * server_url is also used in the front-end
 *
 */


fs.readFile('../config.json', 
		function (err, data) {
        if (err) 
            throw err;
        //sys.puts(data);

        // cut off comments and parse JSON 
		data = data.toString();
		data = data.replace(/\/\/.*/gi,"");
		data = data.replace(/\/\*[^*]+\*\//gm,"");

		config = JSON.parse(data.toString());


		server_url = config.settings.server_url;

		client = new faye.Client("http://"+server_url+":80/comet");

		exports.server.listen(80,server_url);//fire up server
		sys.puts("started a server");
		});


fayeServer.attach(exports.server);
setInterval( function(){checkPlayersAlive();} , 1000 );

