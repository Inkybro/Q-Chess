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
			askServAboutName: function(name) {
				/*
				 * make a request to the server and ask if the name
				 * was already registered by someone else or if it looks funny(does not respect those 
				 * regexes and 5-10 chars conditions
				 *
				 * if all is ok then the server sends to the client a list with all connected clients
				 * and the table
				 * 
				 * if something is wrong the user gets some message and the process stops there
				 *
				 */
				 
			}
		},
		construct: function(fn) {// maybe not the best method to get context, need to re-read docs
			this.base(arguments,"Pre-game settings"); // call qx.ui.window.Window constructor with those args
			this.setWidth(300);
			this.setHeight(40);
			this.setShowMinimize(false);




			var layout2= new qx.ui.layout.HBox();
			var layout = new qx.ui.layout.VBox();
			this.setLayout(layout);

			var container = new qx.ui.container.Composite(layout2);
				var label  = new qx.ui.basic.Label("Player name:").set({	});
				var input1 = new qx.ui.form.TextField("playername").set( {maxLength: 15		});
				container.add(label);
				container.add(input1);
			this.add(container);

			input1.focus();

			startButton = new qx.ui.form.Button("Join chess playground", "resource/qoox_chess/dialog-apply.png");
			startButton.addListener("execute",function() {
					try {
						fn(input1.getValue());
					} catch(e) {
					};
			});
			this.add(startButton);
		}
	}
);

