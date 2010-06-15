var sys    = require('sys'     ) ,
	chess  = require('./chess' ) ,
	assert = require('assert'  ) ;
	//test   = require('test'    ) ;


var t = new chess.Table();
t.move( [[0,1],[0,2]] );
assert.equal( t.table[1][0] , "empty" , "second row first column empty" );
assert.equal( t.table[2][0] , "wpawn" , "third row first column contains a white pawn" );




//if every test goes fine it should only output "ok"
sys.puts("ok");

//test.run();
//sys.p(t);
