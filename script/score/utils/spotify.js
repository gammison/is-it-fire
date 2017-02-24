const spotifyApi = require("spotify-web-api-node");
const client = new spotifyApi();

module.exports = siteInfo => new Promise((resolve, reject) => {
	const {
      link,
      siteName,
      loc
    } = siteInfo;
    if (siteName.includes("open.spotify.com")) {
    	// get id of link (last part of URL)
    	const contentId = loc.path.split('/').pop();
    	( loc.path.includes("album") ? client.getAlbum(contentId)
    	: loc.path.includes("track") ? client.getTrack(contentId)
    	: loc.path.includes("artist") ? client.getArtist(contentId)
    	: Promise.reject('spotify link was not an album, track, or artist') )
    	.then(data => resolve(data.body.popularity))
    	.catch(error => {
    		console.log(error);
    		resolve(-1);
    	})
    } else {
    	resolve(-1)
    }
});