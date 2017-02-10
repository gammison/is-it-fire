"use strict";

module.exports = (app, tester, emailer) => {
  app.get("/", (_, res) => {
    res.send("Hello");
  });
};