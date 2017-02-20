"use strict";

const cheerio = require("cheerio");
const denodeify = require("denodeify");
const request = denodeify(require("request"));
const url = require("url");

const getGoogleRank = require("./google.js");
const getAlexaRank = require("./alexa.js");
const getYoutubeRank = require("./youtube.js");

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
	resolve(scores.reduce((sum, val) => sum + val) / scores.length);
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