const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        try {
            await interaction.reply({
                embeds: [
                    {
                        title: 'Hello!',
                        description: 'This is a **rich** embed.',
                        color: 0x00ff00,
                        image: { url: 'https://picfiles.alphacoders.com/590/thumb-1920-590617.jpg' }
                    }
                ]
            });
        } catch (err) {
            console.error('❌ fail to respone :', err);
        }
    },
};
