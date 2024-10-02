const cheerio = require("cheerio");
const axios =  require("axios");
const fs = require("fs");

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

    const dataExposants = [];

    const exposants = data(".exposant");

    console.log(data(".exposant").find(".bonjourcommentallezvous").length);

    exposants.each((index, exp) => {
        const emplacement = data(exp).find(".exposant__stand").text();
        const nouveau = (data(exp).find(".exposant__nouveau").length >= 1 ? true : false);
        const nom = data(exp).find(".exposant__nom").text().trim();
        let tag = data(exp).find(".exposant__tag").text().trim();
        tag = tag.replace(/\s\s+/g, ' ');

        const dataExposant = {
            [nom] : {
                emplacement: emplacement,
                estNoveau: nouveau,
                tag: tag
            }};
        dataExposants.push(dataExposant);
    });

    console.log("nouveaux : "+data(".exposant").find(".exposant__nouveau").length);
    console.log("exposants: "+data(".exposant").find(".exposant__stand").length);
    console.log("noms     : "+data(".exposant").find(".exposant__nom").length);

    console.log("exposants : " + JSON.stringify(dataExposants[1]));


}



performScraping();
