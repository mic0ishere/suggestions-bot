const suggestionModel = require("../lib/suggestionModel");

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ButtonInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferUpdate();

  const isUpvote = interaction.customId === "suggestion-upvote";
  const suggestionMessage = interaction.message;

  const suggestion = await suggestionModel.findOne({
    messageId: suggestionMessage.id,
  });

  if (!suggestion) {
    return interaction.followUp({
      content: "❌ Couldn't find this suggestion",
      ephemeral: true,
    });
  } else if (suggestion.status !== "pending") {
    return interaction.followUp({
      content: "❌ You can no longer vote on this suggestion",
      ephemeral: true,
    });
  }

  const upvotes = suggestion.upvotes.filter((x) => x !== interaction.user.id);
  const downvotes = suggestion.upvotes.filter((x) => x !== interaction.user.id);

  if (isUpvote) upvotes.push(interaction.user.id);
  else downvotes.push(interaction.user.id);

  await suggestion.updateOne({
    upvotes,
    downvotes,
  });

  await interaction.editReply({
    embeds: [
      {
        ...suggestionMessage.embeds[0].data,
        footer: {
          ...suggestionMessage.embeds[0].data.footer,
          text: `Votes: ${upvotes.length}✅ ${downvotes.length}❌  • Suggestion ID #${suggestion.suggestionId} `,
        },
        timestamp: new Date().toISOString(),
      },
    ],
  });

  await interaction.followUp({
    content: `✅ You have ${
      isUpvote ? "upvoted" : "downvoted"
    } this suggestion`,
    ephemeral: true,
  });
};
