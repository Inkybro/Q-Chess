







qx.Class.define("qoox_chess.Cell",{
    extend: qx.ui.core.Widget,
	construct: function(col){
		this.base(arguments);
		this.setBackgroundColor(col);
		this.setWidth(50);
		this.setHeight(50);
	},
    members: {
    },
    properties: {
    }
}
);



      //var doc = this.getRoot();
	  //var x =new test1.Cell("red");
	  //doc.add(x,{ left: 100, top:100 });

