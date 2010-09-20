var sys    = require('sys'     ) ,
	chess  = require('./chess' ) ,
	assert = require('assert'  ) ;
	//test   = require('test'    ) ;


var t1 = new chess.Table();
var t2 = new chess.Table();
var t3 = new chess.Table();
var t4 = new chess.Table();
var t5 = new chess.Table();


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


sys.puts("-------------------------------------------------------------");
t3.move( [6,4] , [5,4] ); // open up a pawn
//t3.print();
t3.move( [7,3] , [3,7] ); // move queen to attack
//t3.print();
assert.equal(
		t3.legal_move([3,7],[1,5]) ,
		true,
		"queen can attack the pawn");
t3.move( [3,7] , [1,5] ); // attack pawn with queen


assert.equal(
		t3.legal_move([1,5],[2,4]),
		true,
		"queen can move one square south-west");

t3.print();


sys.puts("-------------------------------------------------------------");

t4.move([6,4],[5,4]);
t4.move([5,4],[4,4]);
t4.move([4,4],[3,4]);
t4.move([1,4],[2,4]);


//this move isn't legal because
//two pawns to attack each other this way
assert.equal(
		t4.legal_move([2,4],[3,4]) ,
		false,
		"attack pawn fail");
t4.print();


sys.puts("-------------------------------------------------------------");











sys.puts("-------------------------------------------------------------");

//if every test goes fine it should only output "ok"
sys.puts("ok");

//test.run();
//sys.p(t);



