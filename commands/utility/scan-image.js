const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scanimages')
        .setDescription('Fetch images from this channel'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.channel;
        let fetched;
        let totalImages = 0;
        let lastId;

        do {
            fetched = await channel.messages.fetch({ limit: 100, before: lastId });
            lastId = fetched.last()?.id;

            for (const msg of fetched.values()) {
                if (msg.attachments.size > 0) {
                    for (const attachment of msg.attachments.values()) {
                        if (attachment.contentType?.startsWith('image')) {
                            // Send image info to your server
                            await axios.post('http://localhost:8080/images', {
                                user: msg.author.username,
                                image: attachment.url,
                                filename: attachment.name, // ✅ send the filename
                                time: msg.createdAt.toISOString()
                            });
                            totalImages++;
                        }
                    }
                }
            }
        } while (fetched.size === 100); // fetch until fewer than 100 messages returned

        await interaction.editReply(`✅ Found and logged ${totalImages} images!`);
    }
};
