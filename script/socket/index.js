"use strict";

module.exports = (io, scorer) => {
  io.of("/score").on("connection", socket => {
    socket.on('get_rating', item => {
      scorer(item).then(score => {
        socket.emit('receive_rating', score);
      })
      .catch(err => console.log("error calling scorer", err));
    });
  })
}