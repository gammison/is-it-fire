"use strict";

const getGoogleRank = require("./google.js");
const getAlexaRank = require("./alexa.js");
const getYoutubeRank = require("./youtube.js");

module.exports = {
  "getGoogleRank" : getGoogleRank,
  "getAlexaRank" : getAlexaRank,
  "getYoutubeRank" : getYoutubeRank
};