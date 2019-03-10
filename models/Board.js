const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }]
  },
  {
    timestamps: true // created_at, updatedAt
  }
);

const Board = mongoose.model("Board", boardSchema);

module.exports = { Board, boardSchema };
