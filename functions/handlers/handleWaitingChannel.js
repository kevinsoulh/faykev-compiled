"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discord_js_1 = require("discord.js");
module.exports = async (client) => {
    client.handleWaitingChannel = async () => {
        client.on(discord_js_1.Events.VoiceStateUpdate, async (oldState, newState) => {
            let newUserChannel = newState.channel;
            let oldUserChannel = oldState.channel;
            if (oldUserChannel === null && newUserChannel !== null) {
                if (newUserChannel.id === process.env.waitingChannelId) {
                    // User joins a voice channel
                    handleVoiceChannel(newUserChannel);
                }
            }
            else if (oldUserChannel !== null && newUserChannel !== null) {
                if (newUserChannel.id === process.env.waitingChannelId) {
                    // User was moved from one channel to another
                    handleVoiceChannel(newUserChannel);
                }
            }
        });
    };
    async function handleVoiceChannel(voiceChannel) {
        let members = voiceChannel.members;
        if (members.size > 1) {
            // Move all users to a different voice channel
            let targetVoiceChannel = client.channels.cache.get(process.env.justTalkingChannelId || '');
            if (!targetVoiceChannel)
                return console.error("The target voice channel does not exist");
            for (let member of members.values()) {
                await member.voice.setChannel(targetVoiceChannel);
            }
        }
    }
};
