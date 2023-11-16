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
        .setName("get-embeddings")
        .setDescription("Get all available SD embeddings (textual inversions)"),
    async execute(interaction) {
        try {
            const res = await needle('get', sd_api_url + "/sdapi/v1/embeddings");
            let samps = [];

            if (res.statusCode === 200) {
                for (const key in res.body["loaded"]) {
                    if (res.body["loaded"].hasOwnProperty(key)) {
                        const value = res.body["loaded"][key];
                        samps.push(key);
                    }
                }
                await interaction.reply("Embeddings:\n" + samps.join('\n'));
            } else {
                console.error("Request failed with status code: " + res.statusCode);
                await interaction.reply("Failed to fetch embeddings.");
            }
        } catch (error) {
            console.error("Error:", error);
            await interaction.reply("An error occurred while fetching embeddings.");
        }
    },
};