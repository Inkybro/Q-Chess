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

			var piece = this.table[m[0][1]][m[0][0]];
			if(			piece == 'empty') {
				sys.puts("trying to m empty piece");
				return;
			} else if(	this.table[m[1][1]][m[1][0]] != 'empty') {
				sys.puts("trying to m a piece onto another");
				return;
			};
			
			this.table[m[0][1]][m[0][0]] = 'empty';
			this.table[m[1][1]][m[1][0]] = piece;
		};
	this.print =
		function() {
		};
};

exports.Table = Table;


