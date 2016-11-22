
let Server=require("./index.js");

let config={
    port:7770,
    password:'96188',

    path:require('path').join(__dirname,'level')
};

let serv=new Server(config);
serv.listen();
serv.on('error',(err)=>{
    console.log(err);
})
serv.on('start',(port)=>{
    console.log('服务已启动 port:'+port);
})













