const fs = require('fs');

function handleEvents(client) {
    client.commands = new Map();

    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
        }
    });
}

module.exports = { handleEvents };