const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isOwner, isAuthorized, isChannelAllowed } = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass_dm')
        .setDescription('Send a DM to all members in the server.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The message ID or link to copy')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('embed')
                .setDescription('Send message as an embed?')),

    async execute(interaction) {
        const ownerId = process.env.OWNER_ID;
        const serverIds = process.env.SERVER_IDS.split(',');
        const channelIds = process.env.CHANNEL_IDS.split(',');
        const logChannelId = process.env.LOG_CHANNEL_ID;
        const guild = interaction.guild;
        const channelId = interaction.channel.id;

        if (!serverIds.includes(guild.id) || !isChannelAllowed(channelId)) {
            return interaction.reply({ content: "This bot is not authorized to work in this channel.", ephemeral: true });
        }

        if (!isOwner(interaction.user.id) && !isAuthorized(interaction.user.id)) {
            return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        }

        const message = interaction.options.getString('message');
        const messageId = interaction.options.getString('message_id');
        const embedMode = interaction.options.getBoolean('embed');

        if (!message && !messageId) {
            return interaction.reply({ content: "You must provide a message or a message ID/link.", ephemeral: true });
        }

        let content = message;

        if (messageId) {
            try {
                const channel = interaction.channel;
                const fetchedMessage = await channel.messages.fetch(messageId);
                content = fetchedMessage.content;
            } catch (error) {
                return interaction.reply({ content: "Invalid message ID or message not found.", ephemeral: true });
            }
        }

        await interaction.deferReply({ flags: 64 });

        const members = await guild.members.fetch();
        let count = 0;
        let logMessages = [];

        for (const [_, member] of members) {
            if (!member.user.bot) {
                try {
                    if (embedMode) {
                        const embed = new EmbedBuilder()
                            .setTitle('📢 Announcement')
                            .setDescription(content)
                            .setColor(0x0099ff)
                            .setFooter({ text: `Sent by ${interaction.user.username}` });

                        await member.send({ embeds: [embed] });
                    } else {
                        await member.send(content);
                    }
                    count++;
                    logMessages.push(`✅ ${member.user.tag} - ${new Date().toLocaleString()}`);
                } catch (error) {
                    logMessages.push(`❌ ${member.user.tag} - Failed`);
                }
            }
        }

    
        const logChannel = await guild.channels.fetch(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle(`BRUUUH DM BOT (${new Date().toLocaleString()})`)
                .setDescription(logMessages.join('\n'))
                .setColor(0xff0000);

            await logChannel.send({ embeds: [logEmbed] });
        }

        await interaction.editReply({ content: `Direct Messages sent to ${count} 'dm-announcement'` });
    }
};