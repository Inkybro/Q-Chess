Qooxdoo chess
=============

A chess UI written using qooxdoo RIA framework.
A chess game server written using Node.js 

Dependencies
============

qooxdoo 1.1 sdk   unzipped in the same directory where you git clone this repo.  
http://downloads.sourceforge.net/qooxdoo/qooxdoo-1.1-sdk.zip


aptitude install libssl-dev build-essential


node.js 0.1.98    installed
http://nodejs.org/dist/node-v0.1.98.tar.gz


Installation
============

Make a symlink to qooxdoo-1.1-sdk to this directory(will be used by the server to serve
the qooxdoo files and images).

In config.json change settings.server_url to what you need.

Install npm on your system and install faye afterwards with it.
(npm install faye) and then symlink the faye browser component while in qchess/source/
ln -s /usr/local/lib/node/.npm/faye/0.5.2/package/faye-browser-min.js faye-browser-min.js


Running
=======

cd server
ln -s <path_to_qooxdoo-1.1-sdk>
chmod +x generate.py
./generate.py build
node serv.js &
firefox http://localhost/build/index.html





