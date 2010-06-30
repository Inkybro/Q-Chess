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

			var layout = new qx.ui.layout.VBox();
			this.setLayout(layout);


			var input1 = new qx.ui.form.TextField("--> Write your name here").set({ maxLength: 15 });
			input1.focus();
			this.add(input1);

			startButton = new qx.ui.form.Button("Join chess playground", "dialog-apply.png");
			this.add(startButton);
		}
	}
);


