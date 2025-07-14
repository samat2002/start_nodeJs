const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Send an image to your Node.js server')
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('Upload an image')
                .setRequired(true)),

    async execute(interaction) {
        const attachment = interaction.options.getAttachment('image');

        try {
            await axios.post('http://localhost:8080/images', {
                user: interaction.user.username,
                image: attachment.url,
                filename: attachment.name,
                time: new Date().toISOString()
            });

            await interaction.reply('✅ Image sent to your Node.js server!');
        } catch (err) {
            console.error('❌ Failed to send image log:', err);
            await interaction.reply('⚠️ Failed to send to your server.');
        }
    }
};