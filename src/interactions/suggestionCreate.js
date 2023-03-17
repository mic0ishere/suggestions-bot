const { TextInputBuilder } = require("@discordjs/builders");
const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
  const suggestionModal = new ModalBuilder()
    .setTitle("New Suggestion")
    .setCustomId("suggestion-modal")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("suggestion")
          .setLabel("Suggestion")
          .setPlaceholder("Type your suggestion here...")
          .setMinLength(5)
          .setMaxLength(1000)
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
      )
    );

  await interaction.showModal(suggestionModal);
};
