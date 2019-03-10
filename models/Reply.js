const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    text: String,
    delete_password: String,
    thread_id: { type: mongoose.Schema.Types.ObjectId, ref: "Thread" },
    reported: { type: Boolean, default: false }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = { Reply, replySchema };
