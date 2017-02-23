"use strict";

module.exports = (app, scorer) => {
  app.get("/", (_, res) => {
    res.render("home");
  });

  app.post("/api/isFire", (req, res) => {
  	scorer(req.body.litLink)
  		.then(score => {
  			res.json({ rating: score });
  		})
  		.catch(err => console.log("error calling scorer", err));
  });
};