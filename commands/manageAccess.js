const { SlashCommandBuilder } = require('discord.js');
const { isOwner, addAuthorized, removeAuthorized } = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manage-access')
        .setDescription('Manage authorized users, channels, and servers.')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Authorize a user, channel, or server')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Select type (user, channel, server)')
                        .setRequired(true)
                        .addChoices(
                            { name: 'User', value: 'users' },
                            { name: 'Channel', value: 'channels' },
                            { name: 'Server', value: 'servers' }
                        ))
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('Enter the ID')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Remove authorization')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Select type (user, channel, server)')
                        .setRequired(true)
                        .addChoices(
                            { name: 'User', value: 'users' },
                            { name: 'Channel', value: 'channels' },
                            { name: 'Server', value: 'servers' }
                        ))
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('Enter the ID')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('list')
                .setDescription('View authorized users, channels, and servers')),

    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const type = interaction.options.getString('type');
        const id = interaction.options.getString('id');

        if (subcommand === 'add') {
            addAuthorized(type, id);
            return interaction.reply({ content: `✅ Added ${id} to ${type}.` });
        }

        if (subcommand === 'remove') {
            removeAuthorized(type, id);
            return interaction.reply({ content: `❌ Removed ${id} from ${type}.` });
        }

        if (subcommand === 'list') {
            const fs = require('fs');
            const data = JSON.parse(fs.readFileSync('./authorized.json'));
            return interaction.reply({ content: `**Authorized Users:** ${data.users.join(', ') || 'None'}\n**Authorized Channels:** ${data.channels.join(', ') || 'None'}\n**Authorized Servers:** ${data.servers.join(', ') || 'None'}` });
        }
    }
};