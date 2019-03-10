function getThreadController(req, res) {
  let {
    params: { board }
  } = req;

  Thread.find({ board: board })
    // .populate("replies")
    .populate({
      path: "replies",
      // match: { createdAt: "descending" },
      // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
      // select: "name -_id",
      options: { limit: 3 }
    })
    .sort({ updatedAt: "descending" })
    .limit(10)
    .exec(function(err, docs) {
      if (err) console.error("mongoose error:  - finding Threads\n" + err);

      let transformed = docs.map(thread => {
        // let replyCount = thread.replies.length;
        let newObj = thread.toObject();
        let replyCount = newObj.replies.length;
        newObj.replycount = replyCount;
        return newObj;
      });

      res.status(200).json(transformed);
    });
}

module.exports = { getThreadController };
