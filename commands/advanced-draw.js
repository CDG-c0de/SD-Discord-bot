const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const { token, sd_api_url } = require('../config.json');
const fs = require('node:fs');
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
        .setName('draw')
        .setDescription('Draw command with model, VAE, seed, sampler, prompt and negative prompt')
        .addStringOption(option =>
            option.setName('model')
                .setDescription("The image model, get list of models with 'get-models' command")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sampler')
                .setDescription("The sampler, get list of samplers with 'get-samplers' command")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('The prompt describing the desired image')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('restore-faces')
                .setDescription('Whether faces should be restored (only recommended on realistic models)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('vae')
                .setDescription("The VAE, get list of VAEs with 'get-vae' command")
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('seed')
                .setDescription('The seed to use for image generation (leave empty for random)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('neg-prompt')
                .setDescription("The negative prompt, get list of embeddings with 'get-embeddings' command")
                .setRequired(false)),
    async execute(interaction) {
        await interaction.reply("Generating...");
        var check_string = interaction.options.getString('model');
        var vae = interaction.options.getString('vae');
        var seed_inp = interaction.options.getNumber('seed')
        var sampler = interaction.options.getString('sampler');
        var draw_prompt = interaction.options.getString('prompt');
        var neg_prompt = interaction.options.getString('neg-prompt');
        var res_faces = interaction.options.getBoolean('restore-faces');

        opt_pay = {
            sd_model_checkpoint: check_string,
            sd_vae: vae
        };

        await needle('post', sd_api_url + '/sdapi/v1/options', opt_pay, { json: true });

        if (!seed_inp) {
            seed_inp = -1;
        }

        pay = {
            prompt: draw_prompt,
            negative_prompt: (neg_prompt),
            steps: 30,
            sampler_index: sampler,
            seed: seed_inp,
            restore_faces: res_faces
        };

        const res = await needle('post', sd_api_url + '/sdapi/v1/txt2img', pay, { json: true });
        let img = Buffer.from(String(res.body["images"][0]).split(",", 1)[0], 'base64');
        const seed = String(res.body["info"]).split('seed": ')[1].split(',')[0];
        fs.writeFileSync("output.png", img, "binary");
        if (!neg_prompt) {
            neg_prompt = "none";
        } else {
            neg_prompt = res.body["info"].split('negative_prompt": "')[1].split('", "all_negative_prompts":')[0];
        }
        if (!vae) {
            vae = "none";
        } else {
            vae = res.body["info"].split('sd_vae_name": "')[1].split('",')[0];
        }
        draw_prompt = res.body["info"].split('prompt": "')[1].split('", "all_prompts":')[0];
        sampler = res.body["info"].split('sampler_name": "')[1].split('",')[0];
        res_faces = res.body["info"].split('restore_faces": ')[1].split(',')[0];
        check_string =  res.body["info"].split('"sd_model_name": "')[1].split('",')[0];
        const file = new AttachmentBuilder('output.png');
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('AI generated image')
            .setAuthor({ name: String(bot_name), iconURL: 'https://cdn.discordapp.com/avatars/' + bot_id + '/' + bot_avatar })
            .setDescription('Image generated with model: ' + check_string + ', seed: ' + seed)
            .addFields(
                { name: 'Prompt:', value: String(draw_prompt) },
                { name: 'Negative prompt', value: String(neg_prompt) },
                { name: 'Sampler', value: String(sampler) },
                { name: 'VAE', value: String(vae) },
                { name: 'Restore faces?', value: String(res_faces) },
            )
            .setImage('attachment://output.png')
            .setTimestamp()
            .setFooter({ text: 'Generated by ' + interaction.member.user.tag, iconURL: 'https://cdn.discordapp.com/avatars/' + interaction.member.id + '/' + interaction.member.user.avatar });
        interaction.editReply({ embeds: [exampleEmbed], files: [file] });
    },
};
