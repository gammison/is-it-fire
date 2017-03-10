"use strict";

const cheerio = require("cheerio");
const denodeify = require("denodeify");
const request = denodeify(require("request"));

module.exports = siteInfo => {
    return new Promise((resolve, reject) => {
        
        const {
            link,
            siteName
        } = siteInfo;
        
        if (siteName.indexOf("genius") !== 0) {
            request(link)
                .then(response => {
                    const body = cheerio.load(response.body);
                    
                    const views = body(".metadata_unit-views").text().replace(/,\s/ig, "");
                
                    //comma and quotation marks, and WHITE SPACE replacement symbols
                          //body(".song_metadata_preview u-half_top_margin").slice(1).eq(0).attr('title').text(); 
                                //--- test by removing .text()
                console.log(views);
                const score = parseInt(views);
                console.log("genius checked");
                console.log(score);
                
                resolve(score);     
            })
            .catch(err => {
                reject(err);
            });
        } else {
            resolve(-1);
        }
    });
};