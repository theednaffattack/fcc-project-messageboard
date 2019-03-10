const { Reply } = require("../models/Reply");

function reportReplyController(req, res) {
  let { reply_id } = req.body;
  const query = { _id: reply_id };
  Reply.findOneAndUpdate({ _id: reply_id }, { $set: { reported: true } }).exec(
    function(err, doc) {
      if (err) console.error(err);
      console.log("view doc");
      console.log(doc);
      console.log(reply_id);
      if (!doc) res.send("no doc found!");
      res.status(200).send("success");
    }
  );
}

module.exports = { reportReplyController };
