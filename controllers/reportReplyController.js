const { Reply } = require("../models/Reply");

function reportReplyController(req, res) {
  let { reply_id } = req.body;
  const query = { _id: reply_id };
  Reply.findOneAndUpdate(query, { $set: { reported: true } }).exec(function(
    err,
    doc
  ) {
    if (err) console.error(err);
    if (!doc) res.send("no doc found!");
    res.status(200).send("success");
  });
}

module.exports = { reportReplyController };
