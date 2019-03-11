/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// const mongoose = require("mongoose");
const queryString = require("query-string");
const { Board } = require("../models/Board");
const { Thread } = require("../models/Thread");
const { Reply } = require("../models/Reply");

const {
  deleteThreadController
} = require("../controllers/deleteThreadController");
const { getThreadController } = require("../controllers/getThreadController");
const {
  createThreadController
} = require("../controllers/createThreadController");
const {
  reportThreadController
} = require("../controllers/reportThreadController");

const {
  deleteReplyController
} = require("../controllers/deleteReplyController");
const {
  reportReplyController
} = require("../controllers/reportReplyController");

const { log } = console;
const { stringify: str } = JSON;

module.exports = function(app) {
  app.route("/api/threads/:board").get(function(req, res) {
    let {
      params: { board }
    } = req;

    let results = [];

    Thread.find({ board: board })
      .populate({
        path: "replies"
        // options: { limit: 3 }
      })
      .sort({ updatedAt: "descending" })
      .limit(10)
      .exec(async function(err, docs) {
        if (err) console.error("mongoose error:  - finding Threads\n" + err);

        let transformed = docs.map(thread => {
          let newObj = {};
          let returnCount;
          let {
            text,
            _id,
            createdAt: created_on,
            updatedAt: bumped_on,
            replies
          } = thread.toObject();

          newObj.replycount = replies.length;
          let truncReplies = replies;
          if (replies.length > 3) {
            truncReplies.length = 3;
          }

          newObj.text = text;
          newObj._id = _id;
          newObj.created_on = created_on;
          newObj.bumped_on = bumped_on;
          // newObj.replies = replies.length > 0 ? [first, second, third] : [];
          newObj.replies = truncReplies.filter(Boolean);

          return newObj;
        });

        res.status(200).json(transformed);
      });
  });

  // POST NEW THREAD
  // Story 4: I can POST a thread to a specific message board by passing form
  // data text and delete_password to /api/threads/{board}.(Recomend
  // res.redirect to board page /b/{board}) Saved will be _id, text,
  // created_on(date&time), bumped_on(date&time, starts same as created_on),
  // reported(boolean), delete_password, & replies(array).
  app.route("/api/threads/:board").post(function(req, res) {
    let { text, delete_password, board } = req.body;

    var hash = bcrypt.hashSync(delete_password, 12);

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
  });

  app.route("/api/threads/:board").delete(deleteThreadController);

  app.route("/api/threads/:board").put(reportThreadController);

  // GET ALL REPLIES FOR THREAD /api/threads/:board?thread_id=123456...

  // Story 7: I can GET an entire thread with all it's replies from
  // /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
  app.route("/api/replies/:board").get(function(req, res) {
    let { thread_id } = req;

    let checkObject =
      Object.keys(req.query).length > 0 ? "QUERY_PRESENT" : "QUERY_ABSENT";

    // const queryKey = req.query[Object.keys(req.query)[0]];
    const entries = Object.entries(req.query);
    const [key, value] = entries[0];

    Thread.findById(value)
      .select("-reported -delete_password")
      .populate({
        path: "replies",
        // match: { createdAt: "descending" }
        // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
        select: "-reported -delete_password",
        options: { createdAt: "descending" }
      })
      .sort({ updatedAt: "descending" })
      // .limit(10)
      .exec(function(err, docs) {
        if (err) console.error("mongoose error: \n" + err);
        let replies = docs.replies.map(reply => {
          // let { createdAt: created_on, updatedAt: bumped_on } = reply;
          let newObj = {};
          // reply.created_on = reply.createdAt;
          // reply.bumped_on = reply.updatedAt;

          newObj.created_on = reply.createdAt;
          newObj.bumped_on = reply.updatedAt;
          newObj.thread_id = reply.thread_id;
          newObj.text = reply.text;
          newObj._id = reply._id;

          return newObj;
        });
        // docs.replies = newReplies;
        let {
          _id,
          board,
          reported,
          text,
          createdAt: created_on,
          updatedAt: bumped_on
        } = docs;
        let returnObj = {
          _id,
          board,
          reported,
          text,
          created_on,
          bumped_on,
          replies
        };

        res.status(200).json(returnObj);
      });
    // res.send({ status: checkObject });
    // Thread.findById(thread_id, (err, doc) => {
    //   if (err) res.status(400).send(err);
    //   let { reported, delete_password, ...rest } = doc;
    //   res.status(200).json({ rest });
    // });
  });

  // POST NEW REPLY
  // post reply for a thread
  app.route("/api/replies/:board").post(function(req, res) {
    let { text, delete_password, thread_id, board } = req.body;

    const hash = bcrypt.hashSync(delete_password, 12);

    let reply = new Reply({ text, delete_password: hash, thread_id });
    reply.save(
      { text, delete_password, thread_id, board },
      (error, replyDoc, rowsAffected) => {
        if (error) return res.status(400).send(error);
        // res.status(200).json(replyDoc);

        Thread.findById(thread_id, (err, threadDoc) => {
          if (err) return res.status(400).send(err);
          if (!threadDoc) return res.status(400).send(new Error("No thread!"));

          threadDoc.replies.push(replyDoc);
          threadDoc.save(function(err) {
            if (err) return res.send(err);
            res.status(200).redirect(`/b/${threadDoc.board}/${thread_id}`);
          });
        });
      }
    );
    // reply.save(function(error, doc, rowsAffected) {
    //   if (error) console.error("POST ERROR: " + error.message);
    //   let { _id, text, createdAt: created_on, delete_password, reported } = doc;
    //   console.log("success!");
    //   console.log(_id, text, created_on, delete_password, reported);
    // });
  });

  app.route("/api/replies/:board").delete(deleteReplyController);

  app.route("/api/replies/:board").put(reportReplyController);
};
