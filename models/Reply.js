const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    text: String,
    delete_password: String,
    thread_id: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" }
  },
  {
    timestamps: true // created_at, updatedAt
  }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = { Reply, replySchema };
