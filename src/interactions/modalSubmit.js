const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const generateNextID = require("../lib/generateNextID");
const suggestionModel = require("../lib/suggestionModel");

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').ModalSubmitInteraction} interaction
 */
module.exports = async (client, interaction) => {
  const suggestion = interaction.fields.getTextInputValue("suggestion");

  await interaction.reply({
    content: "🕑 Processing your suggestion...",
    ephemeral: true,
  });

  const suggestionId = await generateNextID();

  const suggestionEmbed = new EmbedBuilder()
    .setTitle("New Suggestion")
    .setThumbnail(interaction.user.avatarURL())
    .setDescription(
      `${interaction.user} submitted a new suggestion.\n\n\`\`\`${suggestion}\`\`\``
    )
    .setTimestamp()
    .setColor(client.config.colors.default)
    .setFooter({
      iconURL: interaction.user.avatarURL(),
      text: `Votes: 0✅ 0❌  • Suggestion #${suggestionId} `,
    });

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`suggestion-upvote`)
      .setEmoji("✅")
      .setStyle(ButtonStyle.Success)
      .setLabel("Upvote"),
    new ButtonBuilder()
      .setCustomId(`suggestion-downvote`)
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Downvote")
  );

  const suggestionChannel = await client.channels.fetch(
    process.env.SUGGESTION_CHANNEL_ID
  );

  const suggestionMessage = await suggestionChannel.send({
    embeds: [suggestionEmbed],
    components: [buttons],
  });

  await suggestionModel.create({
    guildId: interaction.guildId,
    channelId: process.env.SUGGESTION_CHANNEL_ID,
    messageId: suggestionMessage.id,
    suggestionId: suggestionId,
    authorId: interaction.user.id,
    content: suggestion,
  });

  await interaction.editReply({
    content: `✅ Your suggestion has been submitted to ${suggestionChannel}`,
  });
};
