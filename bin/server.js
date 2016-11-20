/**
 * Created by codeorg.com on 2016/11/20.
 */
const net = require('net');
const events = require('events');
const util=require('co-util');

class Server extends events.EventEmitter{
    constructor(opts){
        super();
        //this._opts=opts;
        util
        console.log(util.guid())
    }
    validator(opts){
        if(!this._opts.path) throw new Error('leveldb path is null!');
    }
    start(){
        let serv = net.createServer((socket) => {
            socket.on('data',  (data)=>{
                socket.end('goodbye\n');
            });
            socket.on('error', function (err) {
                //console.log(err);
            });


        }).on('error', (err) => {
            // handle errors here
            throw err;
        });

        serv.listen({
            host: '127.0.0.1',
            port: 7777,
            exclusive: true
        },() => {
            console.log('opened server on', serv.address());
        });
    }
}
module.exports=Server;
