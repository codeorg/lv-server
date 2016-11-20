/**
 * Created by Codeorg.com on 2016/9/30.
 */
"use strict";
var net = require('net');
var path = require('path');
//var adapter = require('./common/adapter');
var config = require('../config');
var utility = require('./utility');
var LevelBase = require('./LevelBase');

class LevelServer{
    constructor() {
        this.lv={};
        config.levelServer.dbs.forEach( (item)=>{
            let o={path:path.join(__dirname,'../level/'+item.db)}
            if(item.expire)o.expire=item.expire;
            o.session=!!item.session;
            //o.prefix=item.prefix||"";
            this.lv[item.db]=new LevelBase(o);
        });
        this.createServer();
    }
    createServer() {
        this.server = net.createServer((socket)=> {
            var str = '';
            socket.on('data',  (data)=>{
                str += data.toString();
                if (str.indexOf("}") !== -1) {
                    let obj = this.parse(str);
                    var level = this.lv[obj.db]
                    console.log(obj);

                    level[obj.fn].apply(level, obj.args).then(function (res) {
                        //console.log(JSON.stringify(obj),"=",JSON.stringify(res))
                        if(typeof res=='object') res=JSON.stringify(res);
                        socket.write(res);
                    });
                }
            });
            socket.on('error', function (err) {
                //console.log(err);
            });

        });
        this.server.on('error', (err) => {
            console.log(err);
            setTimeout( () =>{
                this.server.close();
                this.server.listen(config.levelServer.port,function(){
                    console.log('服务已启动 port:'+config.levelServer.port);
                });
            }, 1000);
        });

        this.server.listen(config.levelServer.port, function() {
            console.log('服务已启动 port:'+config.levelServer.port);
        });
    }
    parse(str) {
        if (!str) return "";
        str = str.replace(/^\{([\w\W]+)\}$/, "$1");
        str = utility.aesDecrypt(str, config.levelServer.password);
        str = "{" + str + "}";
        return JSON.parse(str);
    }
}


module.exports=new LevelServer();




