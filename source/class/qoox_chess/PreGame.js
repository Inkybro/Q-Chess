/* ************************************************************************

http://github.com/wsdookadr

This will be the window in which the user will write his username

************************************************************************ */

/* ************************************************************************

#asset(qoox_chess/*)

************************************************************************ */


qx.Class.define("qoox_chess.PreGame",
	{
		extend: qx.ui.window.Window,
		members: {
		},
		construct: function() {
			this.base(arguments,"Username");
			this.setWidth(300);
			this.setHeight(200);
			this.setShowMinimize(false);
		}
	}
);


