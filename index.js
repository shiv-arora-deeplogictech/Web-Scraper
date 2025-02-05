const https = require("https");
const url="https://time.com/";

function fetchHTML(url,callback){
    https.get(url,(res)=> {
        let data= "";

        res.on("data",(chunk)=> {
            data+=chunk;
        });

        res.on("end", ()=> {
            callback(null,extractData(data));
        });
    }).on("error",(err)=>{
        callback(err,null);
    });
}

function extractData(data){
    const articles =[];

    const articleMatches =[...data.matchAll(/<div class="latest-stories__item.*?href="(\/\d{4}\/\d{2}\/\d{2}\/.*?)".*?>(.*?)<\/div>/g)];

    for(let match of articleMatches){
        if(articles.length >=5){
            break;
        }

        const articleUrl = url+match[1];
        const title = match[2].replace(/<.*?>/g, "").trim();

        if (title) {
            articles.push({ title, url: articleUrl });
        }
    }
    return JSON.stringify({ latest_news: articles }, null, 2);
}

fetchHTML(url, (err, jsonData) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log(jsonData);
    }
});