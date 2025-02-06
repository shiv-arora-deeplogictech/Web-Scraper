const https = require("https");
const { JSDOM } = require("jsdom"); 

const url = "https://time.com/";

function fetchHTML(url, callback) {
    https.get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            callback(null, extractData(data));
        });
    }).on("error", (err) => {
        callback(err, null);
    });
}

function extractData(data) {
    const dom = new JSDOM(data);
    const document = dom.window.document;

    const articles = [];
    const listItems = document.querySelectorAll(".latest-stories__item"); 

    for (let li of listItems) {
        const anchor = li.querySelector("a[href]"); 
        const h3 = li.querySelector("h3"); 

        if (anchor && h3) {
            const articleUrl = url + anchor.getAttribute("href"); 
            const title = h3.textContent.trim();

            articles.push({ title, url: articleUrl });

            if (articles.length >= 5) break; 
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
