"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const { commands } = client;
        const command = commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction, client);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
