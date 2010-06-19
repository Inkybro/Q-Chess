/*
 * http://github.com/wsdookadr
 *
 * abstracting the chess game and the moves
 *
 */

var sys = require('sys');

function Table() {
	this.table = 
		[
			["wrook","wknight","wbishop","wking","wqueen","wbishop","wknight","wrook"],
			["wpawn","wpawn  ","wpawn  ","wpawn","wpawn ","wpawn  ","wpawn  ","wpawn"],
			["empty","empty  ","empty  ","empty","empty ","empty  ","empty  ","empty"],
			["empty","empty  ","empty  ","empty","empty ","empty  ","empty  ","empty"],
			["empty","empty  ","empty  ","empty","empty ","empty  ","empty  ","empty"],
			["empty","empty  ","empty  ","empty","empty ","empty  ","empty  ","empty"],
			["pawn ","pawn   ","pawn   ","pawn ","pawn  ","pawn   ","pawn   ","pawn "],
			["rook ","knight ","bishop ","queen","king  ","bishop ","knight ","rook "]
		];
	this.move =
		function (m) {
			//move format [[xstart,ystart],[xend,yend]]
			var startx = m[0][0];
			var starty = m[0][1];
			var	  endx = m[1][0];
			var	  endy = m[1][1];

			var piece = this.table[starty][startx];
			if(			piece == "empty") {
				sys.puts("trying to m empty piece");
				return;
			} else if(	this.table[endy][endx] != "empty") {
				sys.puts("trying to m a piece onto another");
				return;
			};
			
			this.table[starty][startx] = "empty";
			this.table[	 endy][	 endx] = piece;
		};
	this.nothing_inbetween=
		function(p1,p2) {
			// p1 and p2 must be positions on some diagonal
			// check if there's anything in between them or if everything's empty
			var i = p1;

			var dx;
			var dy;

			if(p1[0] < p2[0])
				dx = +1;
			else if(p1[0] == p2[0])
				dx =  0;
			else
				dx = -1;

			if(p1[1] < p2[1])
				dy = +1;
			else if(p1[1] == p2[1])
				dy =  0;
			else
				dy = -1;

			if(dx == 0&& dy==0)// this should never happen
				return false;

			i[0] += dx;
			i[1] += dy;


			while(! (i[0]==p2[0]&&i[1]==p2[1]) ){

				if(this.table[i[0]][i[1]] != "empty")
					return false;

				i[0] += dx;
				i[1] += dy;

			};

			return true;
		};
	this.legal_move =
		function(start,end) {
			sys.puts("checking legal -> "+sys.p([start,end]));

			//move format [[xstart,ystart],[xend,yend]]
			var startx = start[0];
			var starty = start[1];
			var	  endx =   end[0];
			var	  endy =   end[1];

			var dx = Math.abs(startx - endx);
			var dy = Math.abs(starty - endy);
			
			var typeregex = new RegExp("(pawn|rock|queen|bishop|knight|king)","");
			var piecename = typeregex.exec(this.table[starty][startx])[0];

			var color = "white";
			if(this.table[starty][startx].charAt(0) == 'b')
				color = "black";

			// this case is for black
			switch(piecename) {
				case "pawn":
					if(
							starty - endy == 1 &&
							startx == endx
					  )//one row higher
						return true;
					break;
				case "knight":
					//no need to check dx or dy outside bounds because
					//they can only drop on cells which are already in bounds
					if( 
							(dx == 2 && dy==1)||
							(dx == 1 && dy==2)
					  )
						return true;
					break;
				case "bishop":
					if(dx == dy && this.nothing_inbetween(start,end)) {
						return true;
					};
					break;
				case "king":
					if( dx <= 1 &&
							dy <= 1)
						return true;
					break;
				case "queen":
					if( (
								dx == dy  || 
								dx == 0   ||
								dy == 0
						) && this.nothing_inbetween(start,end)
					  )
						return true;
					break;
				default:;
			};

			return false;
		};

	this.print =
		function() {
		};
};

exports.Table = Table;


