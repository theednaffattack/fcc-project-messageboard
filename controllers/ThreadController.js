const { Thread } = require("../models/Thread");

function ThreadController() {
  // save new thread
  this.postThread = function({ boardName, text, delete_password, callback }) {
    const thread = new Thread({
      boardName,
      text,
      delete_password
    });
    thread.save((error, doc, rowsAffected) => {
      if (error) console.error("SAVE ERROR: `Thread` model");
      let {
        _id,
        boardName,
        createdAt: created_on,
        updatedAt: bumped_on,
        delete_password,
        replies,
        reported,
        text
      } = doc;
      callback(null, {
        _id,
        boardName,
        createdAt: created_on,
        updatedAt: bumped_on,
        delete_password,
        replies,
        reported,
        text
      });
      // res.redirect(200, "/b/:board");
    });
  };
}

module.exports = ThreadController;
