/**
 * Created by Codeorg.com on 2016/11/13.
 */
"use strict";
let net = require('net');
var server = net.createServer((socket) => {
    //_socket.end('goodbye\n');
    socket.on('data',  (data)=>{
        console.log(data.toString());
        socket.end('goodbye\n');
    });
    socket.on('error', function (err) {
        //console.log(err);
    });


}).on('error', (err) => {
    // handle errors here
    throw err;
});

server.listen({
    host: '127.0.0.1',
    port: 7777,
    exclusive: true
},() => {
    console.log('opened server on', server.address());
});
