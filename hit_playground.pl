# Takes as parameter a Qooxdoo script, escapes the characters, starts
# Firefox directly in the Qooxdoo playground with the script open there
# 
# so you can write in vi
#
# :!perl hit_playground.pl %
#
# and it will start your current script inside Qooxdoo playground and
# copy the shortened URL to your clipboard
#


use strict;
use warnings;
use URI::Escape;
use Perl6::Slurp;
use WWW::Shorten::TinyURL;

my $code = slurp($ARGV[0]);

$code =uri_escape_utf8($code,"^A-Za-z");
$code = "{\"code\": \"$code\" }";
$code =uri_escape_utf8($code,"^A-Za-z");

my $url = "http://demo.qooxdoo.org/current/playground/#$code";

my $shorturl = makeashorterlink($url);#shorten the url
print $shorturl;



`echo "$shorturl" | xsel -i`; #put it in the clipboard

my $command = "firefox \"$shorturl\"";#start FF with the code in it
system($command);


