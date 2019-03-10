const { Thread } = require("../models/Thread");
const bcrypt = require("bcrypt");

function deleteThreadController(req, res) {
  let { delete_password, thread_id } = req.body;
  Thread.findById(thread_id, function(err, doc) {
    if (err) {
      res.send("incorrect thread_id");
      return;
    }
    //
    if (!doc) return new Error("no doc!!!");

    if (!bcrypt.compareSync(delete_password, doc.delete_password)) {
      res.send("incorrect password");
      return;
    }

    console.log("DOC: " + doc);

    Thread.findByIdAndDelete(thread_id).exec(function(err, doc) {
      if (err) console.error(err);
      //
      res.status(200).send("success");
    });
  });
}

module.exports = { deleteThreadController };
