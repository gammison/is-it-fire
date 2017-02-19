"use strict";

const cheerio = require("cheerio");
const denodeify = require("denodeify");
const request = denodeify(require("request"));
const url = require("url");
const alexa = denodeify(require("alexa-traffic-rank").AlexaWebData);
const trends = require("google-trends-api");

const HTTP_HEADER = "http://";
const HTTPS_HEADER = "https://";
const WWW_HEADER = "www";

const formatLink = link => {
	const checkProtocol = testLink => {
		return testLink.startsWith(HTTP_HEADER) || testLink.startsWith(HTTPS_HEADER);
	};

	return checkProtocol(link) ? link : HTTPS_HEADER + (link.startsWith(WWW_HEADER) ? link.substring(4) : link);
};

const combineResults = scores => new Promise((resolve, _) => {
	// console.log(scores);
	// return average score
	resolve(scores.reduce((sum, val) => sum + val) / scores.length);
});

const getAlexaRank = siteInfo => new Promise((resolve, reject) => {
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

const getGoogleRank = siteInfo => new Promise((resolve, _) => {
	const keywords = siteInfo.keywords;
// console.log(keywords)
	Promise.all(keywords.map(keyword => {
			// return new Promise((resolve, reject) => {
				return trends.interestOverTime({keyword: 'Women\'s march'}, (err, res) => {
					if (err) {
						console.error(err);
						// reject(err);
					}
  				else {
  					console.log('my sweet sweet results', res);
  					// resolve(res);
  				}
				});
			// })
		}))
		.then(trendfo => trendfo.reduce((sum, val) => {
			// const {
			// 	"default": {
			// 		timelineData
			// 	}
			// } = JSON.parse(val);

			// if (timelineData.length <= 0) {
			// 	return sum;
			// }

			// return sum + timelineData.pop().value; // get most recent popularity value
		}))
		.then(sum => sum / keywords.length)
		.then(average => resolve(average))
		.catch(err => {
			// console.log(err);

			resolve(-1);
		});
});

const getYoutubeRank = siteInfo => new Promise((resolve, reject) => {
	const AVG_YOUTUBE_VIEWS = 10000;

	// Make sure site is from youtube, else return -1
	// to indicate this score should not be part of the average

	const {
		link,
		siteName
	} = siteInfo;

	if (siteName.indexOf("youtube") !== 0 || siteName.indexOf("youtu") !== 0) {
		const likeDislikeLink = option => {
			return `.like-button-renderer-${option}-button > .yt-uix-button-content`;
		};

		request(link)
			.then(response => {
				const body = cheerio.load(response.body);

				const views = body(".watch-view-count")
					.first().text()
					.replace(/,|views|\s/ig, "");

				const likes = body(likeDislikeLink("like")).first().text();

				const disLikes = body(likeDislikeLink("dislike")).first().text();

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

module.exports = link => {
	return new Promise((resolve, reject) => {
		const actualLink = formatLink(link);

		const loc = url.parse(actualLink);

		const siteName = loc.hostname;
		const keywords = loc.path.replace(/[0-9]/ig, "").split(/\/|\\|\#|\.|\=|\?|\-|\s/ig).filter(key => key !== "");
		// Get page, get keywords from page, then run them through scoring functions

		request(actualLink)
			// get additional keywords from title
			.then((res) => {
				const title = cheerio.load(res.body)("title");
				const titleKeywords = title.first().text()
					.replace(/[0-9]/ig, "").split(/\/|\\|\#|\.|\=|\?|\-|\s/ig).filter(key => key !== "");
				return {
					"link": actualLink,
					"siteName": siteName,
					"keywords": keywords.concat(titleKeywords),
					"loc": loc
				};
			})
			.then(info => Promise.all([ // give our scoring funcs the info
				getAlexaRank(info),
				getGoogleRank(info),
				getYoutubeRank(info)
			]))
			.then(combineResults) // produce a final score
			.then(finalScore => resolve(finalScore)) // send rating to user
			.catch(err => {
				console.log("Error talking to youtube.");

				reject(err);
			});
	});
};