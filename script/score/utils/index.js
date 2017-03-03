"use strict";

const getGoogleRank = require("./google.js");
const getAlexaRank = require("./alexa.js");
const getYoutubeRank = require("./youtube.js");
const getSpotifyRank = require("./spotify.js");

module.exports = {
  "getGoogleRank" : getGoogleRank,
  "getAlexaRank" : getAlexaRank,
  "getYoutubeRank" : getYoutubeRank,
  "getSpotifyRank": getSpotifyRank
};