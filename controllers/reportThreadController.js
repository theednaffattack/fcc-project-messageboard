const { Thread } = require("../models/Thread");

function reportThreadController(req, res) {
  console.log("reachd!");
  console.log(req.body);
  let { report_id } = req.body;
  const query = { _id: report_id };
  Thread.findOneAndUpdate(query, { $set: { reported: true } }).exec(function(
    err,
    doc
  ) {
    if (err) console.error(err);
    console.log("view doc");
    console.log(doc);
    if (!doc) {
      res.send("no doc found!");
      return;
    }
    res.status(200).send("success");
  });
}

module.exports = { reportThreadController };
