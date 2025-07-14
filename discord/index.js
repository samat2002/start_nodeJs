const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

const token = process.env.BOT_TOKEN;
const TARGET_CHANNEL_ID = process.env.CHANNEL_ID; // 👈 Set this to your target channel ID

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,   // ✅ Add this
        GatewayIntentBits.MessageContent   // ✅ Add this (important!)
    ]
});


client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.channel.id !== TARGET_CHANNEL_ID) return; // 👈 Only listen to your target channel
    if (message.author.bot) return;
    if (message.attachments.size === 0) return;

    for (const attachment of message.attachments.values()) {
        if (attachment.contentType?.startsWith('image')) {
            try {
                await axios.post('http://localhost:8080/images', {
                    user: message.author.username,
                    image: attachment.url,
                    filename: attachment.name,
                    time: message.createdAt.toISOString()
                });
                console.log(`✅ Logged image from ${message.author.username}`);
            } catch (err) {
                console.error('❌ Failed to send image:', err.response?.data || err.message);
            }
        }
    }
});

client.on(Events.InteractionCreate, async interaction => {
    console.log('⚡ Interaction received:', interaction.commandName);

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ No command matching ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error executing ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Error running command.', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Error running command.', ephemeral: true });
        }
    }
});

client.login(token);