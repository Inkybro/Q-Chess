var sys   = require('sys'),
	http  = require('http'),
	url   = require('url'),
	fs    = require('fs'),
	faye    = require('../faye/faye-node'),
	chess = require('./chess'),
	path  = require('path');


/*
 *
 * server-side client for testing faye functionality (faye is a node-js module that implements comet, the bayeux protocol)
 * (doesn't work atm)
 */



var client = new Faye.Client('http://localhost/comet');


client.publish('/comet', {
text: 'Sent from server-side Faye client'
});


