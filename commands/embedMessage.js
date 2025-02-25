const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed-message')
        .setDescription('Create and send an embedded message.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Embed title')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Embed description')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Hex color (e.g., #ff0000 for red)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('Embed footer text')
                .setRequired(false)),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('color') || '#0099ff';
        const footer = interaction.options.getString('footer') || `Sent by ${interaction.user.username}`;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color.replace('#', '0x'))
            .setFooter({ text: footer });

        await interaction.reply({ embeds: [embed] });
    }
};