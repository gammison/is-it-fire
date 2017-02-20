"use strict";

const denodeify = require("denodeify");
const alexa = denodeify(require("alexa-traffic-rank").AlexaWebData);

module.exports = siteInfo => {
  return new Promise((resolve, reject) => {
    alexa(siteInfo.siteName)
      .then(result => {
        const {
          "countryRank": {
            "rank": cRank
          },
          globalRank,
          engagement
        } = result;

        if (globalRank == "-") {
          // alexa has no info on this website
          resolve(-1);
        } else {
          const bounceRate = parseInt(engagement.bounceRate) * 0.01;
          const pageViewPer = parseInt(engagement.dailyPageViewPerVisitor);

          // we need a better formula!
          const rankAvg = Math.abs(100000 - (parseInt(globalRank) + parseInt(cRank)) / 2) * 0.0001;

          const score = (10 * Math.random() + bounceRate * pageViewPer * rankAvg) / 10; // totes random lol

          resolve(score);
        }
      })
      .catch(err => {
        console.log(err);

        reject(err);
      });
  });
};