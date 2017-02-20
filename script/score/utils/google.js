"use strict";

const trends = require("google-trends-api");
const moment = require("moment");

module.exports = siteInfo => {
  return new Promise((resolve, _) => {
    const keywords = siteInfo.keywords;
    const now = moment().calendar();

    Promise.all(keywords.map(keyword => {
        // return new Promise((resolve, reject) => {
        return trends.interestOverTime({
          keyword: keyword,
          startTime: moment().subtract(7, 'days').toDate()
        });
      })).then(trendfo => trendfo.reduce((sum, val) => {
        const {
          "default": {
            timelineData
          }
        } = JSON.parse(val);

        if (timelineData.length <= 0) {
          return sum;
        }

        return sum + timelineData.reduce((x, y) => {
          return x + y.value[0];
        }, 0); // get most recent popularity value
      }, 0))
      .then(sum => {
        return sum / keywords.length;
      })
      .then(average => resolve(average))
      .catch(err => {
        resolve(-1);
      });
  });
};