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

      for (var x=0; x<8; x++)
      {
        layout.setColumnFlex(x, 1);
        layout.setRowFlex(x, 1);

        for (var y=0; y<8; y++) {



          var composite = new qx.ui.container.Composite(new qx.ui.layout.Grow());
          box.add(composite,{row: y, column: x});
	  var newcell   = this.getNewWidget( (((x%2)+(y%2))%2==0) ? "black":"white" , x , y);
          newcell.belongingComposite = composite;// store it here because I haven't found the method for this
                                                 // in the docs yet(need to look some more)
          newcell.setDroppable(true);// we can drop a piece on any of the cells of the 8x8 board


          newcell.addListener("drop", function(e) {
                  //TODO: legal chess moves
                  this.belongingComposite.add(e.getRelatedTarget());
          });


          composite.add(newcell);

          if(y>1 && y<6)
              continue;


          //y==1 or y==6
          //peons
          var piece     = new qx.ui.basic.Image(
                          "resource/qoox_chess/"+
                            (
                             y==1
                             ?"wpeon.PNG"
                             : "peon.PNG"
                            )
                         );



          // knights/rooks/bishop/king/queen
          // arranged so that they are in reverse of the other player
          if(y==0||y==7)
              piece = new qx.ui.basic.Image(
                      "resource/qoox_chess/" + 
                          (
                           y==0 
                           ? "w" + backline[7-x]
                           :       backline[x]
                          )
                      );

          piece.setDraggable(true);


          piece.addListener("dragstart", function(e) {
                  e.addAction("move");
          });




          composite.add(piece);
        }
      }
      return box;
    },
  }


});
