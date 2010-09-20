
echo "Registering someguy and othergirl ..."
GET "127.0.0.1?messagetype=newuser&name=someguy" # registers as someguy
echo ""
GET "127.0.0.1?messagetype=newuser&name=othergirl" # registers as someguy
echo ""
GET "127.0.0.1?messagetype=newuser&name=otherguy" # registers as someguy
echo ""
echo ""
echo ""





echo "Get player list and pings ..."
GET "127.0.0.1?messagetype=get_players_list"     # gets list of all users
echo ""
echo "{ \"messagetype\": \"ping\" }" | POST "127.0.0.1" # ping from unknown
echo ""
echo ""
echo ""



echo "All kinds of moves valid and invalid ..."
echo "{ \"messagetype\": \"newmove\" , \"startpos\": [5,6] , \"endpos\":[6,6] }" | POST "127.0.0.1" # move from "undefined" player
echo ""
echo "{ \"messagetype\": \"newmove\" , \"startpos\": [5,6] , \"endpos\":[6,6] ,\"player_id\":\"someguy\"} " | POST "127.0.0.1" # move from defined player but with empty cell
echo ""
echo "{ \"messagetype\": \"newmove\" , \"startpos\": [6,6] , \"endpos\":[5,6] ,\"player_id\":\"someguy\"} " | POST "127.0.0.1" # correct move on existing player
echo ""
echo "{ \"messagetype\": \"newmove\" , \"startpos\": [6,5] , \"endpos\":[4,5] ,\"player_id\":\"someguy\"} " | POST "127.0.0.1" # incorrect move on existing player
echo ""
echo ""
echo ""
echo ""



#echo "Now othergirl wants to play with someguy and someguy accepts the invitation"
echo "Invitations to start a match ..."
echo "{ \"messagetype\": \"requestMatch\" , \"player1\": \"othergirl\" , \"player2\": \"someguy\" }" | POST "127.0.0.1" # move from "undefined" player
echo ""
echo "{ \"messagetype\": \"acceptRequest\" , \"player\": \"someguy\" , \"requester\": \"othergirl\" }" | POST "127.0.0.1" # move from "undefined" player
echo ""
echo "{ \"messagetype\": \"requestMatch\" , \"player1\": \"otherguy\" , \"player2\": \"othergirl\" }" | POST "127.0.0.1" # move from "undefined" player
echo ""
echo ""
echo ""
echo ""



GET "http://127.0.0.1?messagetype=get_table_state&name=someguy" 
echo "\n"
