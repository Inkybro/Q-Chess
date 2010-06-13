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

    main: function()
    {
      this.base(arguments);

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
    getAnimGrid : function()
    {
      var box = new qx.ui.container.Composite().set({
        decorator: "main",
        backgroundColor: "yellow",
        width: 500,
        height: 500
      });


      var layout = new qx.ui.layout.Grid();
      layout.setSpacing(0);
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

      for (var x=0; x<8; x++)
      {
        layout.setColumnFlex(x, 1);
        layout.setRowFlex(x, 1);

        for (var y=0; y<8; y++) {



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
                  //TODO: legal chess moves

                  var moved_piece = e.getRelatedTarget();
                  var spot        = this;//where it is placed
                  var oldspot = moved_piece.oldspot;

                  var legal = false;

                  //alert(moved_piece.player);
                  //alert(moved_piece.piece_type);

                  if(moved_piece.player == "black") {
                      if(moved_piece.piece_type == "pawn") {
                            if(
                                oldspot.yc - spot.yc == 1 &&
                                oldspot.xc ==spot.xc
                                )//one row higher
                                legal = true;
                      };

                  };

                  //no need to check dx or dy outside bounds because
                  //they can only drop on cells which are already in bounds
                  if(moved_piece.piece_type == "knight") {
                      var dx = Math.abs(oldspot.xc - spot.xc);
                      var dy = Math.abs(oldspot.yc - spot.yc);
                      if( 
                          (dx == 2 && dy==1)||
                          (dx == 1 && dy==2)
                        )
                          legal = true;
                  };


                  if(legal) {
                      //alert("moving");
                      spot.belongingComposite.add(moved_piece);
                      moved_piece.composite = spot.belongingComposite;
                      moved_piece.oldspot = spot;
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
          } else {
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


          piece.setDraggable(true);
          piece.addListener(
                            "dragstart", 
                            function(e) { e.addAction("move"); }
                           );

          piece.oldspot = newcell;
          composite.add(piece);
        }
      }
      return box;
    },
  }


});
