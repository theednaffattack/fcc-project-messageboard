const { Thread } = require("../models/Thread");
const bcrypt = require("bcrypt");

function deleteThreadController(req, res) {
  let { delete_password, thread_id } = req.body;
  Thread.findById(thread_id, function(err, doc) {
    if (err) {
      res.send("mongo error?");
      return;
    }
    //
    if (!doc) {
      res.send("incorrect thread_id");
      return;
    }

    if (!bcrypt.compareSync(delete_password, doc.delete_password)) {
      res.send("incorrect password");
      return;
    }

    Thread.findOneAndRemove(thread_id).exec(function(err, doc) {
      if (err) console.error(err);
      //
      if (doc === null) {
        console.log("DOC IS NULL!!!");
        res.send(
          "hmmmm, this should contain the removed doc but is instead null"
        );
        return;
      }
      if (!doc) {
        res.send("no doc found");
        return;
      }

      res.status(200).send("success");
    });
  });
}

module.exports = { deleteThreadController };
