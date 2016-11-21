/**
 * Created by codeorg.com on 2016/11/20.
 */
const net = require('net');
const events = require('events');
const path=require('path');
const util=require('co-util');
const Level=require('./bin/level');

class Server extends events.EventEmitter{
    constructor(opts){
        super();
        //console.log(opts)
        this._opts=this._validator(opts);
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
    _createLevel(){
        this._levels={};
        this._opts.collections.forEach( (db)=>{
            let obj={path:path.join(this._opts.path,db.name)};
            if(db.expire)obj.expire=db.expire;
            //console.log(obj)
            this._levels[db.name]=new Level(obj);
        })
    }
    _createServer(){
        this._server = net.createServer((socket)=> {
            let str = '';
            socket.on('data',  (data)=> {
                str += data.toString();
                if (str.indexOf("}") !== -1) {
                    let obj;
                    try {
                        obj = this._parse(str);
                    }catch(e){
                        this.emit('error',e);
                        //socket.write(res);
                    }
                    let level = this._levels[obj.db]
                    console.log(obj);
                    level[obj.fn].apply(level, obj.args).then((res) => {
                        if (typeof res == 'object') res = JSON.stringify(res);
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
let config={
    port:7011,
    password:'96188',
    path:require('path').join(__dirname,'level'),
    collections:[{name:'captcha',expire:1000*15},{name:'admin',expire:1000*60*30},{name:'user',expire:1000*60*30},{name:'cache'}]
};

let serv=new Server(config);
serv.listen();
serv.on('start',(port)=>{
    console.log('服务已启动 port:'+port);
})
module.exports=serv;
