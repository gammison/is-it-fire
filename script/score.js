const cheerio = require('cheerio')
const denodeify = require('denodeify')
const request = denodeify(require('request'))
const url = require('url')
const alexa = denodeify(require('alexa-traffic-rank').AlexaWebData)
const trends = require('google-trends-api')

module.exports = (link) => 
new Promise((resolve, reject) => {
	// Break apart URL
	const loc = url.parse(link)
	let siteName = loc.hostname
	let keywords = loc.path.replace(/[0-9]/ig,'').split(/\/|\\|\#|\.|\=|\?|\-|\s/ig).filter(key => key != '')

	// Get page, get keywords from page, then run them through scoring functions
	request(link)
		// get additional keywords from title
		.then((res) => {
			debugger;
			let $ = cheerio.load(res.body)
			let titleKeywords = $('title')
				.first().text().replace(/[0-9]/ig,'').split(/\/|\\|\#|\.|\=|\?|\-|\s/ig).filter(key => key != '')
			keywords = keywords.concat(titleKeywords)
			return {link, siteName, keywords, loc}
		})
		// give our scoring funcs the info
		.then(info => Promise.all([
			getAlexaRank(info),
			getGoogleRank(info),
			getYoutubeRank(info),
		]))
		// produce a final score
		.then(combineResults)
		// send rating to user
		.then(finalScore => resolve(finalScore))
		.catch(err => {
			console.log("Error talking to youtube.")
			reject(err)
		})
})

const combineResults = (scores) => new Promise((resolve, reject) => {
	console.log(scores);
	// return average score
	resolve(scores.reduce((sum, val) => sum+val, 0)/scores.length)
})

const getAlexaRank = (siteInfo) => new Promise((resolve, reject) => {
	alexa(siteInfo.siteName)
		.then(result => {
			if (result.globalRank == '-') {
				// alexa has no info on this website
				resolve(-1)
			} else {
				let bounceRate = parseInt(result.engagement.bounceRate) * .01
				let pageViewPer = parseInt(result.engagement.dailyPageViewPerVisitor)
				let rankAvg = Math.abs(100000 - (parseInt(result.globalRank) + parseInt(result.countryRank.rank))/2) // we need a better formula! 
				rankAvg *= .0001 // scale it down a bit
				let score =(10*Math.random() + bounceRate*pageViewPer*rankAvg) / 10 // totes random lol
				resolve(score)
			}
		})
		.catch(err => {
			console.log(err)
			reject(err)
		})
})

const getGoogleRank = (siteInfo) => new Promise((resolve, reject) => {
	// get trend data for each keyword, then avg / max their values
	console.log('keywords', siteInfo.keywords)
	Promise.all(siteInfo.keywords.map(keyword => trends.interestOverTime({keyword})))
		.then(trendfo => trendfo.reduce((sum, val) => {
			data = JSON.parse(val)
			if (data.default.timelineData.length > 0) {
				return sum + data.default.timelineData.pop().value // get most recent popularity value
			} else {
				// google had no data
				return sum
			}
		}, 0))
		.then(sum => sum / siteInfo.keywords.length)
		.then(average => resolve(average))
		.catch(err => {
			console.log(err)
			resolve(-1)
		})
})

const getYoutubeRank = (siteInfo) => new Promise((resolve, reject) => {
	const AVG_YOUTUBE_VIEWS = 10000
	// Make sure site is from youtube, else return -1 
	// to indicate this score should not be part of the average
	if (siteInfo.siteName == 'youtube.com' || siteInfo.siteName == 'youtu.be') {
		request(link)
			.then(response => {
				let $ = cheerio.load(body)
				let views = $('.watch-view-count')
					.first().text()
					.replace(/,|views|\s/ig, '')
				let score = parseInt(views) / AVG_YOUTUBE_VIEWS
				resolve(score)
			})
			.catch(err => {
				reject(err)
			})
	} else {
		resolve(-1)
	}
})