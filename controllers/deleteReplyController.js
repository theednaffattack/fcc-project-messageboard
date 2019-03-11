// const { Thread } = require("../models/Thread");
const { Reply } = require("../models/Reply");
const bcrypt = require("bcrypt");

function deleteReplyController(req, res) {
  let { delete_password, reply_id, thread_id } = req.body;
  // Reply.findById(reply_id, function(err, doc) {
  Reply.findById(reply_id, function(err, doc) {
    if (err) {
      res.send("mongo error?");
      return;
    }
    //
    if (!doc) {
      res.send("incorrect reply_id");
      return;
    }

    if (!bcrypt.compareSync(delete_password, doc.delete_password)) {
      res.send("incorrect password");
      return;
    }

    Reply.findOneAndRemove(reply_id, function(err, doc) {
      console.log("THIS IS THE REPLY ID I'M LOOKING FOR!!!");
      console.log(reply_id);
      console.log(doc);
      if (err) console.error(err);
      //
      if (doc === null) {
        console.log("DOC IS NULL!!!");
        res.send("for some reason mongo couldn't find the doc, it's null");
        return;
      }
      if (!doc) {
        res.send("doc (in the mongo sense) is not truthy");
        return;
      }

      if (!bcrypt.compareSync(delete_password, doc.delete_password)) {
        res.send("incorrect password");
        return;
      }

      console.log("DOC: " + doc);
      //
      res.status(200).send("success");
    });
  });
}

module.exports = { deleteReplyController };
