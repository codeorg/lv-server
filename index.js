/**
 * Created by codeorg.com on 2016/11/20.
 */
const net = require('net');
const events = require('events');
const path=require('path');
const util=require('co-util');
const Level=require('./bin/level');

class Server extends events.EventEmitter{
    constructor(opts) {
        super();
        this._opts = this._validator(opts);
        this._levels = {};
        util.mkdir(this._opts.path);
        this._createLevel();
        this._createServer();
    }
    _validator(opts){
        if(!opts) throw new Error('lerver _server options is null!');
        if(!opts.path) throw new Error('leveldb path is null!');
        opts.port=opts.port||7770;
        opts.password=opts.password||'codeorg.com';
        return opts;
    }
    _addLevel(db){
        if(!db) return;
        if(this._levels.hasOwnProperty(db)) return;
        this._levels[db]=new Level({path:path.join(this._opts.path,db)});
    }
    _createLevel(){
        util.dirs(this._opts.path).then((files)=>{
            files.forEach( (db)=>{
                this._addLevel(db);
            })
        })

    }
    _createServer(){
        this._server = net.createServer((socket)=> {
            let str = '';
            socket.on('data',  (data)=> {
                //console.log(data.toString());
                str += data.toString();
                if (str.indexOf("}") !== -1) {
                    let obj = this._parse(str);
                    if(!obj){
                        this.emit('error','字符串无法解密');
                        socket.end();
                        return;
                    }
                    if(!this._levels.hasOwnProperty(obj.db))this._addLevel(obj.db);
                    let level = this._levels[obj.db];

                    level[obj.fn].apply(level, obj.args).then((res)=> {
                        //console.log(res)
                        res = JSON.stringify(res);
                        socket.write(res);
                    });
                }
            });
            socket.on('error', function (err) {
                //console.log(err);
            });

        });
        this._server.on('error', (err) => {
            this.emit('error',err);
        });
    }
    _parse(str) {
        if (!str) return "";
        str = str.replace(/^\{([\w\W]+)\}$/, "$1");
        str = util.aesDecrypt(str, this._opts.password);
        if(!str) return null;
        str = "{" + str + "}";
        return JSON.parse(str);
    }
    listen(){
        this._server.listen(this._opts.port, ()=> {
            this.emit('start',this._opts.port);
            //console.log('服务已启动 port:'+this._opts.port);
        });
    }
}

module.exports=Server;
