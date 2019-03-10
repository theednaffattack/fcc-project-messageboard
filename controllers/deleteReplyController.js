// const { Thread } = require("../models/Thread");
const { Reply } = require("../models/Reply");
const bcrypt = require("bcrypt");

function deleteReplyController(req, res) {
  console.log("FUNCTION!!!");
  let { delete_password, reply_id, thread_id } = req.body;
  Reply.findById(reply_id, function(err, doc) {
    res.send("incorrect reply_id");
    //
    if (!doc) return new Error("no doc!!!");

    if (!bcrypt.compareSync(delete_password, doc.delete_password)) {
      res.send("incorrect password");
      return;
    }

    console.log("DOC: " + doc);

    Reply.findByIdAndDelete(reply_id).exec(function(err, doc) {
      if (err) console.error(err);
      //
      res.status(200).send("success");
    });
  });
}

module.exports = { deleteReplyController };
