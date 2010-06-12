/* ************************************************************************

   Copyright:

   License:

   Authors:

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

      container.add(this.getAnimGrid(), {row: 0, column: 0});
    },


    getNewWidget : function(color)
    {
      var widget = new qx.ui.core.Widget().set({
        width: 50,
        height: 50,
        backgroundColor: color
      });

      /*
      widget.addListener("click", function(e)
      {
        if (this._active == widget) {
          return;
        }

        var effects = [];
        var duration = 0.3;

        if (this._active)
        {
          this._active.set({
            backgroundColor : color,
            width: 50,
            height: 50
          });
        }

        widget.set({
            backgroundColor : "orange"
        });

        var bounds = widget.getBounds();

        effects.push(new demobrowser.demo.layout.Grid_Animated_Property(widget, "width").set({
          from: bounds.width,
          to: 200,
          duration: duration,
          transition: "sinodial"
        }));
        effects.push(new demobrowser.demo.layout.Grid_Animated_Property(widget, "height").set({
          from: bounds.height,
          to: 200,
          duration: duration,
          transition: "sinodial"
        }));

        var effect = new qx.fx.effect.core.Parallel(effects[0], effects[1]);
        effect.start();

        this._active = widget;
      }, this);
      */

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

      this._active = null;

      for (var x=0; x<8; x++)
      {
        layout.setColumnFlex(x, 1);
        layout.setRowFlex(x, 1);

        for (var y=0; y<8; y++) {
	  var newcell = this.getNewWidget( (((x%2)+(y%2))%2==0) ? "black":"white") , {row: y, column: x};
	  
          box.add(newcell);
        }
      }
      return box;
    }
  }


});
