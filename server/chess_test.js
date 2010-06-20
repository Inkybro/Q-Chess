var sys    = require('sys'     ) ,
	chess  = require('./chess' ) ,
	assert = require('assert'  ) ;
	//test   = require('test'    ) ;


var t1 = new chess.Table();
var t2 = new chess.Table();


assert.notEqual(t1,t2,"t1!=t2");


t1.move( [1,0],[2,0] );



assert.equal(t2.nothing_inbetween([7,5],[5,7]),false,"not yet legal to move bishop");
t2.move( [6,6],[5,6] );
assert.equal( t2.nothing_inbetween([7,5],[5,7]) , true , "bishop was able to move" );
assert.equal( t2.table[6][6] , "empty" , "pawn not there");
assert.equal( t2.table[5][6] , "pawn" , "pawn");



//sys.puts( sys.p(t2.table)+"\n" );
assert.equal( t1.table[1][0] , "empty" , "second row first column empty" );
assert.equal( t1.table[2][0] , "wpawn" , "third row first column contains a white pawn" );





//if every test goes fine it should only output "ok"
sys.puts("ok");

//test.run();
//sys.p(t);
