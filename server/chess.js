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
			["wrook" , "wknight" , "wbishop" , "wking" , "wqueen" , "wbishop" , "wknight" , "wrook"] ,
			["wpawn" , "wpawn"   , "wpawn"   , "wpawn" , "wpawn"  , "wpawn"   , "wpawn"   , "wpawn"] ,
			["empty" , "empty"   , "empty"   , "empty" , "empty"  , "empty"   , "empty"   , "empty"] ,
			["empty" , "empty"   , "empty"   , "empty" , "empty"  , "empty"   , "empty"   , "empty"] ,
			["empty" , "empty"   , "empty"   , "empty" , "empty"  , "empty"   , "empty"   , "empty"] ,
			["empty" , "empty"   , "empty"   , "empty" , "empty"  , "empty"   , "empty"   , "empty"] ,
			["pawn"  , "pawn"    , "pawn"    , "pawn"  , "pawn"   , "pawn"    , "pawn"    , "pawn"]  ,
			["rook"  , "knight"  , "bishop"  , "queen" , "king"   , "bishop"  , "knight"  , "rook"]
		];
	//if move returns false it means the piece has not been moved
	//				   true	it has been moved
	this.move =
		function (p1,p2) {
			//move format [[ystart,xstart],[yend,xend]]
			var startx = p1[1];
			var starty = p1[0];

			var	  endx = p2[1];
			var	  endy = p2[0];

			var piece_start	= this.table[starty][startx];
			var piece_end	=	  this.table[endy][endx];

			sys.puts("move made ("+starty+","+startx+")->"+piece_start+" ; ("+endy+","+endx+")->"+piece_end+"\n");

			if(piece_start == "empty") {
				sys.puts("trying to move empty piece");
				return false;
			};
			
			if(piece_end   != "empty") {
				//todo: if attack then this may be valid

				sys.puts("trying to move a piece onto another \n");
				return false;
			};
			
			this.table[starty][startx] = "empty";
			this.table[	 endy][	 endx] = piece_start;
			
			return true;
		};
	this.nothing_inbetween=
		function(p1,p2) {
			// p1 and p2 must be positions on some diagonal
			// check if there's anything in between them or if everything's empty


			sys.puts(sys.p(p1)+sys.p(p2)+"\n");
			var dx;
			var dy;

			var i = [0,0];
			i[0] = p1[0];
			i[1] = p1[1];


			if(p1[1] < p2[1])
				dx = +1;
			else if(p1[1] == p2[1])
				dx =  0;
			else
				dx = -1;

			if(p1[0] < p2[0])
				dy = +1;
			else if(p1[0] == p2[0])
				dy =  0;
			else
				dy = -1;

			if(dx == 0&& dy==0)// this should never happen
				return false;

			i[0] += dy;
			i[1] += dx;


			while(! (i[0]==p2[0]&&i[1]==p2[1]) ){

				var piecename = this.table[i[0]][i[1]];
				if(piecename != "empty") {
					//sys.puts("at ("+i[0]+",) there is a "+piecename+"\n"):
					sys.puts("("+i[0]+","+i[1]+")"+" "+piecename+"\n");
					return false;
				};

				i[0] += dy;
				i[1] += dx;

			};

			return true;
		};
	this.legal_move =
		function(start,end) {
			//sys.puts("checking legal -> "+sys.p(start]));

			//move format [[xstart,ystart],[xend,yend]]
			var startx = start[1];
			var starty = start[0];
			var	  endx =   end[1];
			var	  endy =   end[0];

			var dx = Math.abs(startx - endx);
			var dy = Math.abs(starty - endy);
			
			var typeregex = new RegExp("(pawn|rook|queen|bishop|knight|king)","");

			sys.puts("actual piece there : "+this.table[starty][startx]+"\n");
			var piecename = typeregex.exec(this.table[starty][startx])[0];
			sys.puts("piece was " + piecename);




			var color = "white";
			if(this.table[starty][startx].charAt(0) == 'b')
				color = "black";

			// this case is for black
			switch(piecename) {
				case "pawn":
					if(
							starty - endy == 1 &&
							dx == 0
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
				case "rook":
					if( (dx == 0   ||
						 dy == 0 ) &&
						this.nothing_inbetween(start,end)
					  )
						return true;
					break;
				default:;
			};

			return false;
		};

	this.print =
		function() {

			var i,j;

			for(i=0;i<this.table.size();i++) {
				sys.puts("\n");
				for(j=0;j<this.table[i].size();j++) {
					sys.puts(this.table[i][j]+"  ");
				};
			};
	};

	this.name = "";//name of the player
};

exports.Table = Table;


