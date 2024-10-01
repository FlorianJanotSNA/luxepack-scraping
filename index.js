const cheerio = require("cheerio");
const axios =  require("axios");

const URL = "https://www.luxepackmonaco.com/visiter-luxe-pack-monaco/exposants-et-sponsors/";

async function performScraping() {
    console.log("hello world!");
    
    const response = await axios.request({
        method: "GET",
        url: `${URL}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const data = cheerio.load(response.data);

    const exposants = data(".exposant");

    console.log(data("bonjouratouscommentallezvous"))

    exposants.each((index, exp) => {
        const emplacement = data(exp).find(".exposant__stand");
        // console.log(emplacement.text());
    });
    

}



performScraping();
