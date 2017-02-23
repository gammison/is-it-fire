"use strict";

if (process.env.NODE_ENV === "production") {
  const child_process = require("child_process");

  child_process.exec("webpack -p --config ./webpack.production.config.js", (error, stdout, stderr) => {
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);

    if (error !== null) {
      console.log("exec error: " + error);
    }
  });
}