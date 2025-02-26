const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { isOwner } = require('../utils/permissions');

const filePath = 'authorized.json';


function loadAuthorizedData() {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}


function saveAuthorizedData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manage-access')
        .setDescription('Manage authorized users, channels, and servers.')
        .addSubcommand(subcommand =>
            subcommand.setName('add-user')
                .setDescription('Add a user to authorized list.')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user to authorize')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove-user')
                .setDescription('Remove a user from authorized list.')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user to remove')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('add-channel')
                .setDescription('Authorize a channel for bot usage.')
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('The channel to authorize')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove-channel')
                .setDescription('Remove a channel from authorized list.')
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('The channel to remove')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('add-server')
                .setDescription('Authorize a server for bot usage.')
                .addStringOption(option => 
                    option.setName('server_id')
                        .setDescription('The server ID to authorize')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove-server')
                .setDescription('Remove a server from authorized list.')
                .addStringOption(option => 
                    option.setName('server_id')
                        .setDescription('The server ID to remove')
                        .setRequired(true))),

    async execute(interaction) {
        if (!isOwner(interaction.user.id)) {
            return interaction.reply({ content: "You don’t have permission to use this command.", ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const authorizedData = loadAuthorizedData();

        let response = '';

        switch (subcommand) {
            case 'add-user': {
                const user = interaction.options.getUser('user');
                if (!authorizedData.users.includes(user.id)) {
                    authorizedData.users.push(user.id);
                    saveAuthorizedData(authorizedData);
                    response = `✅ **${user.tag}** has been added to the authorized users list.`;
                } else {
                    response = `⚠️ **${user.tag}** is already authorized.`;
                }
                break;
            }
            case 'remove-user': {
                const user = interaction.options.getUser('user');
                authorizedData.users = authorizedData.users.filter(id => id !== user.id);
                saveAuthorizedData(authorizedData);
                response = `❌ **${user.tag}** has been removed from authorized users.`;
                break;
            }
            case 'add-channel': {
                const channel = interaction.options.getChannel('channel');
                if (!authorizedData.channels.includes(channel.id)) {
                    authorizedData.channels.push(channel.id);
                    saveAuthorizedData(authorizedData);
                    response = `✅ Channel **${channel.name}** has been authorized.`;
                } else {
                    response = `⚠️ Channel **${channel.name}** is already authorized.`;
                }
                break;
            }
            case 'remove-channel': {
                const channel = interaction.options.getChannel('channel');
                authorizedData.channels = authorizedData.channels.filter(id => id !== channel.id);
                saveAuthorizedData(authorizedData);
                response = `❌ Channel **${channel.name}** has been removed from authorized list.`;
                break;
            }
            case 'add-server': {
                const serverId = interaction.options.getString('server_id');
                if (!authorizedData.servers.includes(serverId)) {
                    authorizedData.servers.push(serverId);
                    saveAuthorizedData(authorizedData);
                    response = `✅ Server ID **${serverId}** has been authorized.`;
                } else {
                    response = `⚠️ Server ID **${serverId}** is already authorized.`;
                }
                break;
            }
            case 'remove-server': {
                const serverId = interaction.options.getString('server_id');
                authorizedData.servers = authorizedData.servers.filter(id => id !== serverId);
                saveAuthorizedData(authorizedData);
                response = `❌ Server ID **${serverId}** has been removed from authorized list.`;
                break;
            }
        }

        await interaction.reply({ content: response, flags: 64 });
    }
};
