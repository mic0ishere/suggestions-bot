const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  messageId: String,
  suggestionId: Number,
  authorId: String,
  content: String,
  upvotes: {
    type: [String],
    default: [],
  },
  downvotes: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "denied", "implemented"],
  },
});

module.exports = mongoose.model("Suggestion", suggestionSchema, "suggestions");
