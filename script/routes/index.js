"use strict";

module.exports = (app, scorer, emailer) => {
  app.get("/", (_, res) => {
    res.render("home");
  });
  app.post("/api/isFire", (req, res) => {
  	// console.dir(req.body);
  	scorer(req.body.litLink)
  		.then(score => {
  			res.json({ rating: score });
  			res.end();
  		})
  		.catch(err => console.log("error calling scorer",err))
  });
};