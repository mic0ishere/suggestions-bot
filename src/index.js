const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const deployCommands = require("./deployCommands");

const suggestionCreate = require("./interactions/suggestionCreate");
const suggestionManager = require("./interactions/suggestionManager");
const modalSubmit = require("./interactions/modalSubmit");
const voteButtons = require("./interactions/voteButtons");

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.config = require("../config.json");

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await deployCommands(client.user.id);
});

client.on("interactionCreate", (interaction) => {
  const interactionId = interaction.customId ?? interaction.commandName;

  if (interaction.isCommand()) {
    if (interactionId === "suggest") {
      suggestionCreate(client, interaction);
    } else if (interactionId === "suggestion-manager") {
      suggestionManager(client, interaction);
    }
  } else if (
    interaction.isModalSubmit() &&
    interactionId === "suggestion-modal"
  ) {
    modalSubmit(client, interaction);
  } else if (
    interaction.isButton() &&
    ["suggestion-upvote", "suggestion-downvote"].includes(interactionId)
  ) {
    voteButtons(client, interaction);
  }
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

client.login(process.env.DISCORD_TOKEN);
