require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { registerCommands } = require('./handlers/commandHandler');
const { handleEvents } = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await registerCommands(client);
});

handleEvents(client);

client.login(process.env.BOT_TOKEN);
