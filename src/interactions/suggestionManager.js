const suggestionModel = require("../lib/suggestionModel");
const { resolveColor } = require("discord.js");

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const subcommand = interaction.options.getSubcommand();
  const suggestionId = interaction.options.getString("id")?.replace("#", "");

  if (!suggestionId) {
    return interaction.followUp({
      content: "❌ Please provide a valid suggestion ID.",
      ephemeral: true,
    });
  }

  const suggestion = await suggestionModel.findOne({
    suggestionId,
  });

  if (!suggestion) {
    return interaction.followUp({
      content: "❌ Couldn't find this suggestion.",
      ephemeral: true,
    });
  }

  const suggestionChannel = await client.channels.fetch(suggestion.channelId);
  const suggestionMessage = await suggestionChannel.messages.fetch(
    suggestion.messageId
  );

  switch (subcommand) {
    case "accept": {
      if (suggestion.status !== "pending") {
        return interaction.followUp({
          content: "❌ You can only deny pending suggestions.",
          ephemeral: true,
        });
      }

      await suggestion.updateOne({
        status: "accepted",
      });

      await suggestionMessage.edit({
        embeds: [
          {
            ...suggestionMessage.embeds[0].data,
            color: resolveColor(client.config.colors.accept),
            footer: {
              ...suggestionMessage.embeds[0].data.footer,
              text: `Approved by ${interaction.user.tag} • Suggestion ID #${suggestion.suggestionId} `,
            },
            timestamp: new Date().toISOString(),
          },
        ],
        components: [],
      });

      await interaction.followUp({
        content: `✅ You have approved this suggestion.`,
        ephemeral: true,
      });

      break;
    }
    case "deny": {
      if (suggestion.status !== "pending") {
        return interaction.followUp({
          content: "❌ You can only deny pending suggestions.",
          ephemeral: true,
        });
      }

      await suggestion.updateOne({
        status: "denied",
      });

      await suggestionMessage.edit({
        embeds: [
          {
            ...suggestionMessage.embeds[0].data,
            color: resolveColor(client.config.colors.deny),
            footer: {
              ...suggestionMessage.embeds[0].data.footer,
              text: `Denied by ${interaction.user.tag} • Suggestion ID #${suggestion.suggestionId} `,
            },
            timestamp: new Date().toISOString(),
          },
        ],
        components: [],
      });

      await interaction.followUp({
        content: `✅ You have denied this suggestion.`,
        ephemeral: true,
      });

      break;
    }
    case "implement": {
      if (suggestion.status !== "accepted") {
        return interaction.followUp({
          content: "❌ You can only implement accepted suggestions.",
          ephemeral: true,
        });
      }

      await suggestion.updateOne({
        status: "implemented",
      });

      await suggestionMessage.edit({
        embeds: [
          {
            ...suggestionMessage.embeds[0].data,
            color: resolveColor(client.config.colors.implement),
            footer: {
              ...suggestionMessage.embeds[0].data.footer,
              text: `Implemented • Suggestion ID #${suggestion.suggestionId} `,
            },
            timestamp: new Date().toISOString(),
          },
        ],
        components: [],
      });

      await interaction.followUp({
        content: `✅ You have set this suggestion as implemented.`,
        ephemeral: true,
      });

      break;
    }
  }
};
