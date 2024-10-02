const cheerio = require("cheerio");
const axios =  require("axios");
const fs = require("fs");
const xlsx = require('xlsx');

// constants for input/output
const URL = "https://www.luxepackmonaco.com/visiter-luxe-pack-monaco/exposants-et-sponsors/";
const JSONOutput = './luxepack.json';


async function performScraping() {

    // HTTP GET Request
    const response = await axios.request({
        method: "GET",
        url: `${URL}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    });

    const pageData = cheerio.load(response.data);



    // EXPOSANTS Scraping

    const dataExposants = [];

    const exposants = pageData(".exposant");
    exposants.each((index, exp) => {
        const data = pageData(exp);

        const name = data.find(".exposant__nom").text().trim();

        let tag = data.find(".exposant__tag").text().trim();
        tag = tag.replace(/\s\s+/g, ' ');   // replace spaces, \n and \t with a single space

        const location = data.find(".exposant__stand").text().trim();
        const isNew = (data.find(".exposant__nouveau").length >= 1 ? true : false);
        const logoLink = data.find(".exposant__logo").attr("data-src");
        const domain = data.attr("data-slug-secteur");
        const luxePackFormulation = ( data.attr("data-salon") === "luxe-pack-formulation" );

        const fullData = {
            tag: tag,
            order: index+1,
            location: location,
            isNew: isNew,
            domain: domain,
            luxe_pack_formulation: luxePackFormulation
        };
        if (logoLink !== undefined) fullData.img = logoLink;

        const dataExposant = {
            [name] : fullData
        };

        dataExposants.push(dataExposant);
    });



    // SPONSORS Scraping

    const dataSponsors = [];

    const sponsors = pageData(".trombi");
    sponsors.each((index, sponsor) => {

        const data = pageData(sponsor).find(".trombi__card");

        const name = data.find(".trombi__if-no-titre").text().trim();
        const img = data.find(".trombi__cont-img").find("div").attr("data-bg");
        const website = pageData(sponsor).find(".trombi__details").find(".trombi__descriptif").find("p").find("a").attr("href");
        const infos = data.find(".trombi__cont-infos").find(".trombi__wrapper-infos").text().trim();


        const fullData = {
            logoURL: img,
            websiteURL: website,
            order: index+1
        };
        if (infos !== "") fullData.description = infos;

        const dataSponsor = {
            [name] : fullData
        };

        dataSponsors.push(dataSponsor);
    });


    const objectData = {
        "sponsors" : dataSponsors,
        "exposants" : dataExposants
    }


    // writeInJSONFile(objectData);

    // creating new xlsx file
    let file = xlsx.utils.book_new();

    // auto write in xlsx file : different sheets for Exposants and Sponsors
    writeInExcelFile(objectData, file, "luxepack.xlsx");


}


function writeInJSONFile(object) {
    fs.writeFile(`${JSONOutput}`, JSON.stringify(object), (error) => {
        if (error) {console.log(error); return;}
        console.log(`File created: ${JSONOutput}` );
    });
}


function writeInExcelFile(object, file, name) {

    const transformData = (object) => {
        const data = [];

        object.forEach((obj) => {
            const name = Object.keys(obj)[0];
            const details = obj[name];

            const row = { name, ...details }; 
            data.push(row);
        });
        return data;
    };


    // data formatting : by rows
    const transformedExposants = transformData(object.exposants);
    const transformedSponsors  = transformData(object.sponsors);

    // creating worksheet
    const worksheet1 = xlsx.utils.json_to_sheet(transformedExposants);
    // adding worksheet to file
    xlsx.utils.book_append_sheet(file, worksheet1, "Exposants");


    const worksheet2 = xlsx.utils.json_to_sheet(transformedSponsors);
    xlsx.utils.book_append_sheet(file, worksheet2, "Sponsors")


    xlsx.writeFile(file, name); // write file

}



performScraping();
