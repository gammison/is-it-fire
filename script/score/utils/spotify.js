"use strict";

const spotifyApi = require("spotify-web-api-node");
const client = new spotifyApi();

const SPOTIFY_MAIN_URL = "open.spotify.com";

const handlers = {
  "album": "getAlbum",
  "track": "getTrack",
  "artist": "getArtist"
};

const rejectSpotify = () => {
  return Promise.reject("spotify link was not an album, track, or artist");
};

module.exports = siteInfo => new Promise(resolve => {
  const {
    siteName,
    "loc": {
      path
    }
  } = siteInfo;

  if (siteName.includes(SPOTIFY_MAIN_URL)) {
    const contentId = path.split("/").pop();
    const request = (() => {
      const matches = Object.entries(handlers).filter(([k, ]) => path.includes(k));
      return matches.length > 0 ? client[matches[0][1]](contentId) : rejectSpotify();
    })();

    request.then(data => resolve(data.body.popularity))
      .catch(error => {
        console.log(error);

        resolve(-1);
      });
  } else {
    resolve(-1);
  }
});