const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slow')
        .setDescription('Simulates a slow command'),
    async execute(interaction) {
        await interaction.deferReply(); // ✅ Tell Discord you're working
        await someSlowFunction();
        await interaction.editReply('Done!');
    },
};