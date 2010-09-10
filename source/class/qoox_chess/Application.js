/* ************************************************************************

http://github.com/wsdookadr

************************************************************************ */

/* ************************************************************************

#asset(qoox_chess/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "qoox_chess"
 */



// TODO: code here needs some serious refactoring(at least getChessGrid ...)




qx.Class.define("qoox_chess.Application",
{
  extend : qx.application.Standalone,
  properties: {
      playerName: {
          check: function(value) {
                  if
                      (
                          value                           &&
                          value.match(/^[a-z0-9]+$/gi,"") &&
                          value.length >= 5               &&
                          value.length <=10
                      ){
                          return true;
                          alert("prepare...");
                      } else {
                          alert("player name must  be between 5-10 alphanumeric lowercase chars");
                          return false;
                      };
          }
      },
    connected: {//after calling initGame() this will be true if it has connected to the server or false otherwise
        check: "Boolean",
        init: false
    },
    playerList:     { check: "Object" },
    chatList:       { check: "Object" },
    messageField:   { check: "Object" }

  },
  
  members :
  {
    //ajaxurl: "http://192.168.0.2",
    id: -1,// id of player that has been connected to the server
	faye_client: null,
	

	listPlayers:null,
	listChat:null,
	textChatMessage:null,
    
    makeRequest: function(verb) {
        var req = 
            new qx.io.remote.Request(
                    qx.core.Setting.server_url,
                    verb,
                    "application/json"
                    );
        req.setTimeout(8);
        return req;
    },
    
    makeGrid: function() {
        var layout = new qx.ui.layout.Grid();
        layout.setSpacing(20);
        var container = new qx.ui.container.Composite(layout);
        container.setPadding(20);
        this.getRoot().add(container, {left:0,top:0}        );
        container.add(this.getChessGrid(this.getRoot()), {row: 0, column: 0});
    },
    makePlayerList: function() {
        var configList = new qx.ui.form.List;
		this.getRoot().add(
				new qx.ui.basic.Label("Player list:"),
				{left:600,top:0}
		);
        this.getRoot().add(configList, {left:600,top:20});
        configList.setScrollbarX("on");
        configList.set({ height: 260, width: 150 });

        this.setPlayerList(configList);
        //var item = new qx.ui.form.ListItem("Player1");
        //item.setEnabled(true);
        //configList.add(item);


        //this.repopulatePlayerList();
    },
	makeChatList: function() {
        var chatList = new qx.ui.form.List;
		var messageField = new qx.ui.form.TextField("Kasparov").set( 
				{
                    maxLength: 50
				});

		messageField.addListener("keyup",function(e){
				if(e.getKeyIdentifier() === "Enter") {
						 this.faye_client.publish('/comet', {
								 sender: this.getPlayerName(),
                                 text:   messageField.getValue(),
								 type: "chatMessage"
						 });
						 messageField.setValue("");
				};
		},this);
	    messageField.setWidth(200);

        chatList.set({ height: 280, width: 300 });
        chatList.setScrollbarX("on");

        this.setChatList(chatList);
		this.setMessageField(messageField);


		this.getRoot().add(
				new qx.ui.basic.Label("Lobby chat:"),
				{left:600,top:280}
		);
        this.getRoot().add(chatList,     { left:600,top:300});
		this.getRoot().add(messageField, { left:600,top:590});
	},

	//repopulatePlayerList won't be needed anymore
    repopulatePlayerList: function() {
        var req = this.makeRequest("GET");

        var context = this;
        req.setParameter("messagetype"    ,"get_players_list"                );
        req.addListener("completed", function(e) { 
                context.getPlayerList().removeAll();
                var data = e.getContent();
                for(i in data.names) {
                    var item = new qx.ui.form.ListItem(data.names[i]);
                    item.setEnabled(true);
                    context.getPlayerList().add(item);
                }
        });
        req.send();
    },


    tellServerImAlive: function(){
        /*
         * tell the server that the client is alive and
         * everything's alright
         *
         *
         * client sends to server a ping message which server records the time of and sends back the last time a request was done
         * server verifies the time and if it's below 3 minutes it means it's ok
         * server checks every 10 minutes for all clients and if it hasn't received a players a ping from them in the last 10 minutes
         * it disconnects them.
         */

        //var req = new qx.io.remote.Request(qx.core.Setting.server_url, "POST", "application/json");
        var req = this.makeRequest("POST");
        var data = {
            messagetype: "ping",
            name: this.getPlayerName(),
            description: "it's all good .."
        };

        var strdata = qx.util.Serializer.toJson(data);
        req.setData(strdata);

        req.addListener("completed", function(e) {
        });

        req.send();

    },
    initGame: function(intercept) {
    

    //qx.core.Setting.server_url <-- it takes this from config.json(in project directory)
        try{
            var req = this.makeRequest("GET");

            req.setParameter("messagetype"    ,"newuser"                );
            req.setParameter("name"            ,this.getPlayerName()    );


            req.addListener("completed", function(e) { 

					try {
						var data = e.getContent();
						//alert(qx.util.Serializer.toJson(e.getContent())); 

						//debugger;
						if(data.messagetype == "error") {
							throw data;
							//alert("error: "+ data.description);
						};

						this.id = this.getPlayerName();
						this.connected = true;

						var timer = qx.util.TimerManager.getInstance();
						timer.start(function(userData, timerId)
									{ 
										this.tellServerImAlive(); 
										//this.repopulatePlayerList();
										//TODO: should also ask for new Players List but if it hasn't changed just send something
										//saying it hasn't changed instead of all the list.
										
										if (++userData.count == 3)
											timer.stop(timerId);
									},
									3000,
									this,
									{ count: 0 }
						);
						intercept();
					}catch(e) {
						console.log("error: "+e.description);
					};
            },this);

            // notify server that a new player has joined
            // server will assign him a new id
            req.send();
        } catch(e) {
            alert("name:"+e.name+"\ndescription:"+e.description+"\nmessage:"+e.message);
        };




        //after initGame is completed this.id will be sent along with any other
        //requests to the server
    },

    main: function()
    {
      this.base(arguments);


      if(qx.core.Variant.isSet("qx.debug","on")) {
          qx.log.appender.Native;
          qx.log.appender.Console;
      };




      var context = this;//need to find a better way without storing the context like this
      var win = new qoox_chess.PreGame(function(val) {
          context.setPlayerName(val);
          context.initGame(function(){
              //alert("intercept!");
              context.makeGrid();
              context.makePlayerList();
			  //debugger;
              context.makeChatList();


			  /*
			   *
			   * First get current players, and then tell everyone that you've also joined
			   *
			   */
			  context.repopulatePlayerList();
			  context.faye_client.publish('/comet', {
					    sender: context.getPlayerName(),
						type: "newPlayer",
					    name: context.getPlayerName()
			  });


              win.close();
              //alert("now player list");
          });//send req to server telling him what your name is
      });
      

      //comet client
      if(Faye) {

		  try {

			  var context = this;
			  var client  = new Faye.Client("http://localhost/comet",{timeout: 120});
			  this.faye_client = client;


			  client.subscribe('/comet', function(message) {

					  if(!message.sender) {
					      console.log(message);
					      return;
					  };

					  switch(message.type) {
						  case "chatMessage":
								  context.getChatList().add(
									  new qx.ui.form.ListItem(
										  "<"+message.sender+">  "+
										  message.text
									  )
								  );
								  break;
						  case "newPlayer":
						          if(message.sender == context.getPlayerName())
								      return;
								  context.getPlayerList().add(new qx.ui.form.ListItem(message.name));
								  break;
						  default:;
					  };
			  });


		  } catch(e) {

              alert("name:"+e.name+"\ndescription:"+e.description+"\nmessage:"+e.message);

		  };
			  

      };



      this.getRoot().add(win,        {left:500, top:20}    );
      win.open();

    },


    getNewWidget : function(color)
    {
      var widget = new qx.ui.core.Widget().set({
        width: 50,
        height: 50,
        backgroundColor: color
      });


      return widget;
    },


    updateSpotPiece: function(oldspot,spot,moved_piece) {
          oldspot.piece = null;
          spot.piece = moved_piece;

          //this.debug("move sent to server");
          spot.belongingComposite.add(moved_piece);

          moved_piece.composite = spot.belongingComposite;
          moved_piece.oldspot = spot;//always last
    },

    //TODO: table_state will offer easy access to the grid pieces
    getChessGrid : function()
    {
      //var table_state;// bi-dimensional 8x8 array with table state
      var context = this;
      var box = new qx.ui.container.Composite().set({
        decorator: "main",
        backgroundColor: "white",
        width: 550,
        height: 550
      });

      var gridSize = 8;




      var layout = new qx.ui.layout.Grid();
      //layout.setSpacing(0);
      box.setLayout(layout);

      var backline = new Array(
              "rock.PNG",
              "knight.PNG",
              "bishop.PNG",
              "queen.PNG",
              "king.PNG",
              "bishop.PNG",
              "knight.PNG",
              "rock.PNG"
      );



      this._active = null;
	  //which kind of piece except for pawns which are treated separately
      var typeregex = new RegExp("(rock|queen|bishop|knight|king)","");


      var x,y,i;

      // fix row height and column width so that different elements won't resize them
      for(i=0;i<gridSize;i++) {
          layout.setColumnWidth(i, 65);
          layout.setRowHeight(    i, 65);
      };

      for (x=0; x<gridSize; x++)
      {
        //table_state[y][x] = null;

        layout.setColumnFlex(x, 0);
        layout.setRowFlex(x, 0);


        for (y=0; y<gridSize; y++) {



          var piece;
          var composite = new qx.ui.container.Composite(new qx.ui.layout.Grow());
          box.add(composite,{row: y, column: x});
          var newcell   = this.getNewWidget( (((x%2)+(y%2))%2!=0) ? "black":"white" , x , y);

          // (x,y) coordinates on the board
          newcell.xc = x;
          newcell.yc = y;

          newcell.belongingComposite = composite;// store it here because I haven't found the method for this
                                                 // in the docs yet(need to look some more)

          newcell.setDroppable(true);// we can drop a piece on any of the cells of the 8x8 board


          // the fact that the drop listener is installed only on
          // cells eliminates the possibility of having 2 pieces in one cell
          // (you can only drop on a cell, but if the cell already has an image on it,
          // then the cell is beneath the image and at the same time the image does not have a drop
          // listener installed on it)


          var context = this;
          newcell.addListener("drop", function(e) {

                  var moved_piece = e.getRelatedTarget();
                  var spot        = this;//where it is placed( where it is dropped )

                  var oldspot = moved_piece.oldspot;// where the moved piece was placed before dragging started
                  var legal = false;

                  try {
                      //var req = new qx.io.remote.Request(qx.core.Setting.server_url, "POST", "application/json");
                      var req = context.makeRequest("POST");

                      var strdata = qx.util.Serializer.toJson({
                            player_id: context.id,
                            messagetype: "newmove",
                            piece: moved_piece.piece_type,
                            color: moved_piece.player,
                            startpos: [oldspot.yc,oldspot.xc],
                              endpos: [   spot.yc,   spot.xc]
                      });

                      //ask server if move is legal
                      req.setData(strdata);
                      req.addListener("completed", function(e) { 

							      
								  //debugger;
                                  var data = e.getContent();
                                  if(data.move_okay)
                                    context.updateSpotPiece(oldspot,spot,moved_piece);
                                  else
                                      alert("server says the move is not legal");
                              },this);
                      req.send();
                  } catch(e) {
                      alert("name:"+e.name+"\ndescription:"+e.description+"\nmessage:"+e.message);
                  };

          });


          composite.add(newcell);

          if(y>1 && y<6)
              continue;
          // from here onwards y can only be in {0,1,6,7}









          if(y==0||y==7) {
              // knights/rooks/bishop/king/queen
              // arranged so that they are in reverse order in comparison to the other player
              var img_name = (y==0 ? 'w' : '') + backline[x] ;

              piece = new qx.ui.basic.Image( "resource/qoox_chess/" + img_name );

              if(img_name) {
                  piece.piece_type = typeregex.exec(img_name);
                  if(piece.piece_type) {
                      piece.piece_type = piece.piece_type[0];
                      piece.player = (y==0)?"white":"black";
                  };
              };
          } else {//just pawns
              piece     = 
                  new qx.ui.basic.Image(
                          "resource/qoox_chess/"+
                              (
                               y==1
                               ?"wpawn.PNG"
                               : "pawn.PNG"
                              )
                          );
              piece.player = (y==1)?"white":"black";
              piece.piece_type = "pawn";
          };

          //table_state[y][x] = piece;


          piece.setDraggable(true);
          piece.addListener(
                            "dragstart", 
                            function(e) { e.addAction("move"); }
                           );

          piece.oldspot = newcell;//the current spot of that piece
          newcell.piece = piece;

          if(piece.player == "white") {//actually just the opposite of the current player

          };


          composite.add(piece);
        }
      };


      return box;
    }
  }


});
