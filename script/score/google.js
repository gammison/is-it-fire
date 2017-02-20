"use strict";

const trends = require("google-trends-api");

module.exports = siteInfo => {
  return new Promise((resolve, _) => {
    const keywords = siteInfo.keywords;

    Promise.all(keywords.map(keyword => {
        // return new Promise((resolve, reject) => {
        return trends.interestOverTime({
          keyword: 'Women\'s march'
        }, (err, res) => {
          if (err) {
            console.error(err);
            // reject(err);
          } else {
            console.log('my sweet sweet results', res);
            // resolve(res);
          }
        });
        // })
      }))
      .then(trendfo => trendfo.reduce((sum, val) => {
        const {
          "default": {
            timelineData
          }
        } = JSON.parse(val);

        if (timelineData.length <= 0) {
          return sum;
        }

        return sum + timelineData.pop().value; // get most recent popularity value
      }))
      .then(sum => sum / keywords.length)
      .then(average => resolve(average))
      .catch(err => {
        // console.log(err);

        resolve(-1);
      });
  });
};