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
								alert("player name must  be between 5-10 alphanumeric chars");
								return false;
							};
				}
			}
		},
		construct: function() {
			this.base(arguments,"Pre-game settings"); // call qx.ui.window.Window constructor with those args
			this.setWidth(300);
			this.setHeight(200);
			this.setShowMinimize(false);


			var layout2= new qx.ui.layout.HBox();
			var layout = new qx.ui.layout.VBox();
			this.setLayout(layout);

			var container = new qx.ui.container.Composite(layout2);
				var label  = new qx.ui.basic.Label("Player name:").set({	});
				var input1 = new qx.ui.form.TextField("Kasparov").set( {maxLength: 15		});
				container.add(label);
				container.add(input1);
			this.add(container);

			input1.focus();

			var context = this; // maybe not the best method to get context, need to re-read docs

			startButton = new qx.ui.form.Button("Join chess playground", "dialog-apply.png");
			startButton.addListener("execute",function() {
					context.setPlayerName(input1.getValue());
					//alert(this);
			});
			this.add(startButton);
		}
	}
);

