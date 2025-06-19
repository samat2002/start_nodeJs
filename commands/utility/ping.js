const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        try {
            console.log('🟢 /ping triggered');
            await interaction.reply('Pong!');
        } catch (err) {
            console.error('❌ Failed to reply to /ping:', err);
        }
    },
};