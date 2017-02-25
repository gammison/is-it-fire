const spotifyApi = require("spotify-web-api-node");
const client = new spotifyApi();

module.exports = siteInfo => new Promise(resolve => {
	const {link, siteName, loc } = siteInfo; 
	if (siteName.includes("open.spotify.com")) {
    	// get id of link (last part of URL)
    	const contentId = loc.path.split('/').pop();

    	let request;
    	if (loc.path.includes("album"))
    		request = client.getAlbum(contentId);
    	else if (loc.path.includes("track"))
    		request = client.getTrack(contentId);
    	else if (loc.path.includes("artist"))
    		request = client.getArtist(contentId);
    	else 
    		request = Promise.reject("spotify link was not an album, track, or artist");
    	
    	request.then(data => resolve(data.body.popularity))
    	.catch(error => {
    		console.log(error);
    		resolve(-1);
    	})
    } else {
    	// Not a spotify link, sentinel value
    	resolve(-1)
    }
});