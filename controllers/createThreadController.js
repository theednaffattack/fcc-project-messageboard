const { Thread } = require("../models/Thread");
const bcrypt = require("bcrypt");

function createThreadController(req, res) {
  let { text, delete_password, board } = req.body;

  var hash = bcrypt.hashSync(delete_password, 12);

  log(str(req.body));

  const thread = new Thread({
    board,
    text,
    delete_password: hash
  });

  thread.save((error, doc, rowsAffected) => {
    if (error) console.error("SAVE ERROR: `Thread` model");
    let {
      _id,
      board,
      createdAt: created_on,
      updatedAt: bumped_on,
      delete_password,
      replies,
      reported,
      text
    } = doc;
    // res.status(200).json({
    //   _id,
    //   board,
    //   created_on,
    //   bumped_on,
    //   delete_password,
    //   replies,
    //   reported,
    //   text
    // });
    res.status(200).redirect(`/b/${board}`);
  });

  // PUT THREADCONTROLLER HERE

  // save a new board? or save a new thread?
  // once that is saved to mongo redirect to the general board showing the message
  // from there they can see what they posted and click for detail
  // REDIRECT TO BOARD WITH ALL BOARD `THREADS
}

module.exports = { createThreadController };
