const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const deployCommands = require("./deployCommands");

const suggestionCreate = require("./interactions/suggestionCreate");
const suggestionManager = require("./interactions/suggestionManager");
const modalSubmit = require("./interactions/modalSubmit");

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

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
  }
});

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  async (err) => {
    if (err) console.log(err);
    console.log("Connected to MongoDB");
  }
);

client.login(process.env.DISCORD_TOKEN);
