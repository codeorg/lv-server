/**
 * Created by codeorg.com on 2016/8/5.
 */
"use strict";
var levelup = require('levelup');
    //ttl  = require('level-ttl');

class Level {
    constructor(opts) {
        this._opts=opts;
        //this._opts.expire=this._opts.expire||10;
        this.db=levelup(this._opts.path);
        // if(this._opts.expire>0)
         this.ssss="sss"
    }
    //获取
    get(key) {
        return new Promise((resolve, reject)=> {
            this.db.get(key, (err, value)=> {
                if (err) {
                    resolve(null);
                } else {
                    //this.db.ttl(key,{ ttl: 1000 * 5  });
                    let obj=JSON.parse(value);
                    //if(this._opts.session)this.set(key,obj);
                    resolve(obj);
                }
            });
        })
    }
    //写入
    set(key, value) {
       //console.log("value",value)
        return new Promise((resolve, reject)=> {
            if (typeof value == "object") value = JSON.stringify(value);
            this.db.put(key, value,  (err) =>{
                if (err) {
                    resolve(false);
                } else {
                    //if(this._opts.expire>0)this.db.ttl(key, this._opts.expire);
                    resolve(true);
                }
            })
        })
    }
    //删除
    remove(key) {
        return new Promise((resolve, reject)=> {
            console.log(key)
            this.db.del(key,  (err) =>{
                console.log(err)
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        })
    }
    find(op) {
        return new Promise((resolve, reject) => {
            var option = {keys: true, values: true, revers: false, fillCache: false};
            //if (this.option.prefix)option.start = this.option.prefix

            if (op) {
                if (typeof op != "object")  op = JSON.parse(op);
                if (op.limit) option.limit = op.limit;
                if (op.start) {
                    option.start = op.start;
                    option.end = op.start.substring(0, op.start.length - 1)
                        + String.fromCharCode(op.start.substr(-1).charCodeAt() + 1);
                }
            }
            console.log(option)
            var arr = [];
            var readStream = this.db.createReadStream(option).on('data',  (data)=>{
                //如果是过期模式的，则不解析成json
                //let obj = this._opts.expire>0?data.value:JSON.parse(data.value);
                let obj = JSON.parse(data.value);
                console.log(data.key,data.value)
                //obj.key = data.key;
                arr.push(obj);
                if (option.limit == 1) {
                    resolve(arr);
                    readStream.destroy();
                }
            }).on('error',  (err) =>{
                resolve(null);
            }).on('close',  ()=> {
                resolve(null);
            }).on('end',  ()=> {
                resolve(arr);
            });

        })
    }




}
module.exports=Level;




