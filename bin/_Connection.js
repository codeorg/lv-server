/**
 * Created by Codeorg.com on 2016/11/13.
 */
"use strict";
let events = require('events');
let net = require('net');
class Connection extends events.EventEmitter{
   constructor(opts,cb){
        super();
        this._opts=opts;
        this.ID=new Date().getTime();
        //
        // var listener1 = function listener1() {
        //     console.log(arguments)
        //     console.log('监听器 listener1 执行。');
        // }
        //
        // // 监听器 #2
        // var listener2 = function listener2() {
        //     //console.log(arguments)
        //     console.log('监听器 listener2 执行。');
        // }
        //
        // // 绑定 connection 事件，处理函数为 listener1
        // this.addListener('connection', listener1);
        //
        // // 绑定 connection 事件，处理函数为 listener2
        // this.on('connection', listener2);

        //this.connect();

    }
    async connect(){
        //this._socket=net.createConnection({port: this._opts.port,host:this._opts.host});

        this._socket = net.connect(this._opts, () => {
            return true;
        });
        this._socket.on('data', (data) => {
            console.log(data.toString());
            this._socket.end();
        });
        this._socket.on('end', () => {
            console.log('disconnected from _server');
            this.emit('end',this);
            //console.log(this._socket)
        });

        this._socket.on('error', (err) => {
            //console.log(err);
            this.emit('error',err,this);
            //console.log(this._socket)
        });

        // this._socket.destroy();
        // this._socket.on('close', () => {
        //     console.log('disconnected from _server');
        //     console.log(this._socket)
        // });


    }
    available(){
        let writable=this._socket.writable;
        if(!writable) {
            if(this._socket) {
                this._socket.end();
            }else {
                this.emit('end',this);
            }
        }
        return writable;
    }
    send(msg){
        this._socket.write(msg);
    }


}
module.exports=Connection;
//let conn=new Connection({port:7777,host:'127.0.0.1'});
//conn.connect()