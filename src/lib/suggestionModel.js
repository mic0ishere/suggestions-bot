const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  messageId: String,
  suggestionId: Number,
  authorId: String,
  content: String,
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "denied", "implemented"],
  },
});

module.exports = mongoose.model("Suggestion", suggestionSchema, "suggestions");
