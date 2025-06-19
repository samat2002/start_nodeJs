const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log') // <- this must match `/log`
        .setDescription('Send a log to your Node.js server')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to log')
                .setRequired(true)),

    async execute(interaction) {
        const text = interaction.options.getString('text');
        try {
            await axios.post('http://localhost:8080/log', {
                user: interaction.user.username,
                message: text,
                time: new Date().toISOString()
            });

            await interaction.reply('✅ Message sent to your Node.js server!');
        } catch (err) {
            console.error('❌ Failed to send log:', err);
            await interaction.reply('⚠️ Failed to send to your server.');
        }
    }
};
