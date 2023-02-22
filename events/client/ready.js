"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'ready',
    onde: true,
    async execute(client) {
        client.user?.setPresence({
            activities: [{
                    name: 'F&K',
                    type: discord_js_1.ActivityType.Watching
                }],
            status: 'online'
        });
        console.log(`${client.user?.tag} - I'm ready!!`);
    }
};
