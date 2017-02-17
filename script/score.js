const cheerio = require('cheerio')
const request = require('request')

module.exports = (link) => 
new Promise((resolve, reject) => {
	request(link, (err, res, body) => {
		if (!err && res.statusCode == 200) {
			let $ = cheerio.load(body)
			let views = $('.watch-view-count')
				.first().text()
				.replace(/,|views|\s/ig, '')
			resolve(views)
		} else {
			console.log("Error talking to youtube.")
			reject(err)
		}
	})
})