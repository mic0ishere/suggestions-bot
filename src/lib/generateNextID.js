const suggestionModel = require("./suggestionModel");

let previousId = null;

module.exports = async () => {
  if (previousId === null) {
    const lastSuggestion = await suggestionModel.findOne().sort({ _id: -1 });
    previousId = lastSuggestion ? lastSuggestion.suggestionId : 0;
  }

  return previousId++;
};
