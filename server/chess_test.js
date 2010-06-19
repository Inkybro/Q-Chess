var sys    = require('sys'     ) ,
	chess  = require('./chess' ) ,
	assert = require('assert'  ) ;
	//test   = require('test'    ) ;


var t1 = new chess.Table();
var t2 = new chess.Table();

t1.move( [[0,1],[0,2]] );
t2.move( [[6,6],[6,5]] );
assert.equal( t1.table[1][0] , "empty" , "second row first column empty" );
assert.equal( t1.table[2][0] , "wpawn" , "third row first column contains a white pawn" );
assert.equal( t2.legal_move([5,7],[7,5]) , "bishop was able to move" );



//if every test goes fine it should only output "ok"
sys.puts("ok");

//test.run();
//sys.p(t);
