const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const { models_path, token, sd_api_url } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');
var needle = require('needle');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let bot_name;
let bot_id;
let bot_avatar;
client.login(token);
client.on('ready', async () => {
    bot_name = client.user.username
    bot_id = client.user.id
    bot_avatar = client.user.avatar
    client.destroy()
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get-samplers")
        .setDescription("Get all available SD samplers"),
    async execute(interaction) {
        try {
            const res = await needle('get', sd_api_url + "/sdapi/v1/samplers");
            let samps = [];

            if (res.statusCode === 200) {
                let it = 0;
                while (res.body[it]) {
                    samps.push(res.body[it]["name"]);
                    it++;
                }

                await interaction.reply(samps.join('\n'));
            } else {
                console.error("Request failed with status code: " + res.statusCode);
                await interaction.reply("Failed to fetch samplers.");
            }
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply("An error occurred while fetching samplers.");
        }
    },
};