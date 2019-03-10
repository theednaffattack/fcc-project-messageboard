const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema(
  {
    text: String,
    board: String,
    reported: { type: Boolean, default: false },
    delete_password: String,
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }]
  },
  {
    timestamps: true // created_at, updatedAt
  }
);

const Thread = mongoose.model("Thread", threadSchema);

module.exports = { Thread, threadSchema };
