const { SlashCommandBuilder, Client, GatewayIntentBits } = require('discord.js');
const { token, sd_api_url } = require('../config.json');
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
        .setName("get-vae")
        .setDescription("Get all available SD VAEs"),
    async execute(interaction) {
        try {
            const res = await needle('get', sd_api_url + "/sdapi/v1/sd-vae");
            let samps = [];

            if (res.statusCode === 200) {
                let it = 0;
                while (res.body[it]) {
                    samps.push(res.body[it]["model_name"]);
                    it++;
                }
                await interaction.reply("VAEs:\n" + samps.join('\n'));
            } else {
                console.error("Request failed with status code: " + res.statusCode);
                await interaction.reply("Failed to fetch VAEs.");
            }
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply("An error occurred while fetching VAEs.");
        }
    },
};