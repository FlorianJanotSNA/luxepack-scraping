const cheerio = require("cheerio");
const axios =  require("axios");
const fs = require("fs");

const URL = "https://www.luxepackmonaco.com/visiter-luxe-pack-monaco/exposants-et-sponsors/";

async function performScraping() {
    
    const response = await axios.request({
        method: "GET",
        url: `${URL}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const pageData = cheerio.load(response.data);

    const dataExposants = [];

    const exposants = pageData(".exposant");


    console.log(JSON.stringify(obj))

    exposants.each((index, exp) => {
        const data = pageData(exp);
        const nom = data.find(".exposant__nom").text().trim();

        let tag = data.find(".exposant__tag").text().trim();
        tag = tag.replace(/\s\s+/g, ' '); // replace spaces, \n and \t with a single space

        const emplacement = data.find(".exposant__stand").text();
        const nouveau = (data.find(".exposant__nouveau").length >= 1 ? true : false);
        const logoLink = data.find(".exposant__logo").attr("data-src");

        const fullData = {
            tag: tag,
            ordre: index+1,
            emplacement: emplacement,
            estNoveau: nouveau
        };
        if (logoLink !== undefined) fullData.img = logoLink;

        const dataExposant = {
            [nom] : fullData
        };

        dataExposants.push(dataExposant);
    });


    writeInJSONFile(dataExposants);
}


function writeInJSONFile(object) {
    fs.writeFile("./object.json", JSON.stringify(object), (error) => {
        if (error) {console.log(error); return;}
        console.log("File created: object.json");
    });
}


performScraping();
