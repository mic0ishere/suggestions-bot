const { REST, Routes } = require("discord.js");
const commands = require("./commands.json");

module.exports = async (clientId) => {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(`Started refreshing application (/) commands.`);

    await rest.put(
      Routes.applicationGuildCommands(clientId, process.env.GUILD_ID),
      { body: commands }
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
};
