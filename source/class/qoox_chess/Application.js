/* ************************************************************************

http://github.com/wsdookadr

************************************************************************ */

/* ************************************************************************

#asset(qoox_chess/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "qoox_chess"
 */
qx.Class.define("qoox_chess.Application",
{
  extend : qx.application.Standalone,

  members :
  {
	//ajaxurl: "http://192.168.0.2",
	id: -1,// id of player that has been connected to the server
	initGame: function() {
	// notify server that a new player has joined
	// server will assign him a new id
	

	//qx.core.Setting.server_url <-- takes it from config.json
		try{
			var req = new qx.io.remote.Request(
				qx.core.Setting.server_url,
				"GET",
				"application/json");

			req.setParameter("messagetype","newuser");
			//req.setData("newuser");
			//"completed" callback here sets this.id


			var context = this;
			req.addListener("completed", function(e) { 
					var data = e.getContent();
					//alert(qx.util.Serializer.toJson(e.getContent())); 
					context.id = data.id;
					alert("You've been just registred in the server with id="+context.id);
			});

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
	  this.initGame();

      var layout = new qx.ui.layout.Grid();
      layout.setSpacing(20);

      var container = new qx.ui.container.Composite(layout);
      container.setPadding(20);

      this.getRoot().add(container, {left:0,top:0});

      container.add(this.getAnimGrid(this.getRoot()), {row: 0, column: 0});

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

    //TODO: table_state will offer easy access to the grid pieces
    getAnimGrid : function()
    {
      //var table_state;// bi-dimensional 8x8 array with table state
	  var context = this;
      var box = new qx.ui.container.Composite().set({
        decorator: "main",
        backgroundColor: "white",
        width: 550,
        height: 550
      });


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
      var typeregex = new RegExp("(rock|queen|bishop|knight|king)","");


      var x,y;

      // fix row height and column width so that different elements won't resize them
      for(x=0;x<8;x++)
          layout.setColumnWidth(x, 65);

      for(y=0;y<8;y++)
          layout.setRowHeight(y, 65);


      for (x=0; x<8; x++)
      {
        //table_state[y][x] = null;

        layout.setColumnFlex(x, 0);
        layout.setRowFlex(x, 0);


        for (y=0; y<8; y++) {



          var piece;
          var composite = new qx.ui.container.Composite(new qx.ui.layout.Grow());
          box.add(composite,{row: y, column: x});
	  var newcell   = this.getNewWidget( (((x%2)+(y%2))%2==0) ? "black":"white" , x , y);

          // (x,y) coordinates on the board
          newcell.xc = x;
          newcell.yc = y;

          newcell.belongingComposite = composite;// store it here because I haven't found the method for this
                                                 // in the docs yet(need to look some more)
                                                 //
          newcell.setDroppable(true);// we can drop a piece on any of the cells of the 8x8 board


          // the fact that the drop listener is installed only on
          // the cells, this also eliminates the possibility of having 2 pieces in one cell
          // (you can only drop on a cell, but if the cell already has an image on it,
          // then the cell is beneath the image and at the same time the image does not have a drop
          // listener installed on it)


          newcell.addListener("drop", function(e) {
                  //legal chess moves
				  //(these should also be checked on the server
				  //to avoid data forgery:)

                  var moved_piece = e.getRelatedTarget();
                  var spot        = this;//where it is placed( where it is dropped )
                  var oldspot = moved_piece.oldspot;// where the moved piece was placed before dragging started
                  var legal = false;

                  //alert(moved_piece.player);
                  //alert(moved_piece.piece_type);


                  //TODO: attack another piece



				  try {
					  var req = new qx.io.remote.Request(qx.core.Setting.server_url, "POST", "application/json");

					  var data = {
							player_id: context.id,
							type: "newmove",
							piece: moved_piece.piece_type,
							color: moved_piece.player,
							startpos: [oldspot.yc,oldspot.xc],
							  endpos: [   spot.yc,   spot.xc]
					  };

					  var strdata = qx.util.Serializer.toJson(data);
					  req.setData(strdata);
					  req.addListener("completed", function(e) { 
								  var data = e.getContent();
								  //alert(data); 
								  if(data.move_okay) {
									  //if everything is ok then move the piece
									  oldspot.piece = null;
									  spot.piece = moved_piece;


									  spot.belongingComposite.add(moved_piece);
									  moved_piece.composite = spot.belongingComposite;

									  moved_piece.oldspot = spot;//always last
								  } else
									  alert("server says the move is not legal");


							  });
					  req.send();
				  } catch(e) {
					  alert("name:"+e.name+"\ndescription:"+e.description+"\nmessage:"+e.message);
				  };



          });


          composite.add(newcell);

          if(y>1 && y<6)
              continue;
          // from here onwards y can only be in {0,1,6,7}


          //y==1 or y==6
          //pawns



          if(y==0||y==7) {
              // knights/rooks/bishop/king/queen
              // arranged so that they are in reverse order in comparison to the other player
              var img_name = 
                  (
                   y==0 
                   ? "w" + backline[7-x]
                   :       backline[x]
                  );

              piece = new qx.ui.basic.Image( "resource/qoox_chess/" + img_name );

              if(img_name) {
                  piece.piece_type = typeregex.exec(img_name);
                  if(piece.piece_type) {
                      piece.piece_type = piece.piece_type[0];
                      if(y == 0) {
                          piece.player = "white";
                      } else {//y==7
                          piece.player = "black";
                      };
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
              if(y==1) {
                  piece.player = "white";
              } else {//y==6
                  piece.player = "black";
              };

              piece.piece_type = "pawn";
          };

          //table_state[y][x] = piece;


          piece.setDraggable(true);
          piece.addListener(
                            "dragstart", 
                            function(e) { e.addAction("move"); }
                           );

          piece.oldspot = newcell;
          newcell.piece = piece;
          composite.add(piece);
        }
      };


      return box;
    },
  }


});
