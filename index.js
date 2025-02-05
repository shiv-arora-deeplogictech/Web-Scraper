const https = require("https");
const url="www.time.com";

function fetchHTML(url){
    https.get(url,(res)=> {
        let data= "";

        res.on("data",(chunk)=> {
            chunk+=data;
        });

        res.on(end, ()=> {
            callback(null,extractData(data));
        });
    }).on("error",(err)=>{
        callback(err,null);
    });
}

