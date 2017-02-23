"use strict";

const cheerio = require("cheerio");
const denodeify = require("denodeify");
const request = denodeify(require("request"));

module.exports = siteInfo => {
  return new Promise((resolve, reject) => {
    // const AVG_YOUTUBE_VIEWS = 10000;

    // Make sure site is from youtube, else return -1
    // to indicate this score should not be part of the average

    const {
      link,
      siteName
    } = siteInfo;

    if (siteName.indexOf("youtube") !== 0 || siteName.indexOf("youtu") !== 0) {
      // const likeDislikeLink = option => {
      //   return `.like-button-renderer-${option}-button > .yt-uix-button-content`;
      // };

      request(link)
        .then(response => {
          const body = cheerio.load(response.body);

          const views = body(".watch-view-count")
            .first().text()
            .replace(/,|views|\s/ig, "");

          // const likes = body(likeDislikeLink("like")).first().text();

          // const disLikes = body(likeDislikeLink("dislike")).first().text();

          const score = parseInt(views);

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