/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;

const { Thread } = require("../models/Thread");
const { Reply } = require("../models/Reply");
const { log } = console;
const { stringify: str } = JSON;

// const thread = new Thread({
//   _id: new mongoose.Types.ObjectId(),
//   name: "Ian Fleming",
//   age: 50
// })

module.exports = function(app) {
  app.route("/api/threads/:board");

  // POST NEW THREAD
  // Story 4: I can POST a thread to a specific message board by passing form
  // data text and delete_password to /api/threads/{board}.(Recomend
  // res.redirect to board page /b/{board}) Saved will be _id, text,
  // created_on(date&time), bumped_on(date&time, starts same as created_on),
  // reported(boolean), delete_password, & replies(array).
  app.route("/api/threads/:board").post(function(req, res) {
    let { text, delete_password } = req.body;
    log(str(req.body));

    const thread = new Thread({
      text,
      delete_password
    });

    thread.save(error => {
      if (error) console.error("SAVE ERROR: `Thread` model");
      res.redirect("/b/:board");
    });

    // save a new board? or save a new thread?
    // once that is saved to mongo redirect to the general board showing the message
    // from there they can see what they posted and click for detail
    // REDIRECT TO BOARD WITH ALL BOARD `THREADS
  });

  app.route("/api/replies/:board");
};
