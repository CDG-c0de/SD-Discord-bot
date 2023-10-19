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

var files_models = fs.readdirSync(path.join(models_path, 'Stable-diffusion'), null, true);
var files_vae = fs.readdirSync(path.join(models_path, 'VAE'), null, true);
var files_textinv = fs.readdirSync(path.join(models_path, '../embeddings'), null, false);
let objects_models = [];
let objects_vae = [];
let objects_textinv = [];

files_models.forEach(o => {
    if (!(o.includes('.yaml'))) {
        objects_models.push({
            name: `${o}`,
            value: `${o}`
        });
    }
});

files_vae.forEach(o => {
    objects_vae.push({
        name: `${o}`,
        value: `${o}`
    });
});

files_textinv.forEach(o => {
    objects_textinv.push({
        name: `${o}`,
        value: `${o}`
    });
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('advanced-draw')
		.setDescription('Advanced draw command with model, VAE, seed, sampler, clip skip, prompt and negative prompt')
		.addStringOption(option => {
			option.setName('style')
				.setDescription('The image style')
				.setRequired(true)
                for (let i = 0; i < objects_models.length; i++) {
                    option.addChoices(objects_models[i])
                }
                return option
        })
        .addStringOption(option =>
            option.setName('sampler')
                .setDescription('The sampler to use when generating the image')
                .setRequired(true)
                .addChoices(
                    { name: 'Euler a', value: 'Euler a' },
                    { name: 'Euler', value: 'Euler' },
                    { name: 'LMS', value: 'LMS' },
                    { name: 'Heun', value: 'Heun' },
                    { name: 'DPM2', value: 'DPM2' },
                    { name: 'DPM2 a', value: 'DPM2 a' },
                    { name: 'DPM++ S2 a', value: 'DPM++ S2 a' },
                    { name: 'DPM++ 2M', value: 'DPM++ 2M' },
                    { name: 'DPM++ SDE', value: 'DPM++ SDE' },
                    { name: 'DPM fast', value: 'DPM fast' },
                    { name: 'DPM adaptive', value: 'DPM adaptive' },
                    { name: 'LMS Karras', value: 'LMS Karras' },
                    { name: 'DPM2 Karras', value: 'DPM2 Karras' },
                    { name: 'DPM2 a Karras', value: 'DPM2 a Karras' },
                    { name: 'DPM++ 2S a Karras', value: 'DPM++ 2S a Karras' },
                    { name: 'DPM++ 2M Karras', value: 'DPM++ 2M Karras' },
                    { name: 'DPM++ SDE Karras', value: 'DPM++ SDE Karras' },
                    { name: 'DDIM', value: 'DDIM' },
                    { name: 'PLMS', value: 'PLMS' },
                    { name: 'UniPC', value: 'UniPC' },
                ))
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('The prompt describing the desired image')
				.setRequired(true))
        .addBooleanOption(option =>
            option.setName('restore-faces')
                .setDescription('Whether faces should be restored (only recommended on realistic models)')
                .setRequired(true))
        .addStringOption(option => {
            option.setName('vae')
                .setDescription('The VAE to use')
                .setRequired(false)
                for (let i = 0; i < objects_vae.length; i++) {
                    option.addChoices(objects_vae[i])
                }
                return option
        })
        .addNumberOption(option => 
            option.setName('seed')
                .setDescription('The seed to use for image generation (leave empty for random)')
                .setRequired(false))
        .addStringOption(option => {
            option.setName('text-inv')
                .setDescription('The textual inversion to use in the negative prompt')
                .setRequired(false)
                for (let i = 0; i < objects_textinv.length; i++) {
                    option.addChoices(objects_textinv[i])
                }
                return option
            })
        .addStringOption(option =>
            option.setName('neg-prompt')
                .setDescription('The negative prompt used to describe undesired results')
                .setRequired(false)),
	async execute(interaction) {
        await interaction.reply("Generating...");
		const check_string = interaction.options.getString('style');
        var vae = interaction.options.getString('vae');
        var seed_inp = interaction.options.getNumber('seed')
        const sampler = interaction.options.getString('sampler');
		const draw_prompt = interaction.options.getString('prompt');
        var neg_prompt = interaction.options.getString('neg-prompt');
        var text_invs = interaction.options.getString('text-inv');
        const res_faces = interaction.options.getBoolean('restore-faces');

		opt_pay = {
			sd_model_checkpoint: check_string,
            sd_vae: vae
		};

        needle('post', sd_api_url + '/sdapi/v1/options', opt_pay, { json: true });

        if (!seed_inp) {
            seed_inp = -1;
        }

        pay = {
            prompt: draw_prompt,
            negative_prompt: (text_invs ? neg_prompt + ' ' + text_invs.split('.')[0] : neg_prompt),
            steps: 30,
            sampler_index: sampler,
            seed: seed_inp,
            restore_faces: res_faces
        };

        needle('post', sd_api_url + '/sdapi/v1/txt2img', pay, { json: true })
			.then((res) => {
				let img = Buffer.from(String(res.body["images"][0]).split(",",1)[0], 'base64');
				const seed = String(res.body["info"]).split('seed": ')[1].split(',')[0];
				fs.writeFileSync("output.png", img, "binary");
				if (!neg_prompt) {
					neg_prompt = "none";
				}
                if (!vae) {
                    vae = "none";
                }
                if (!text_invs) {
                    text_invs = "none";
                }
                const file = new AttachmentBuilder('output.png');
			    const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('AI generated image')
                    .setAuthor({ name: bot_name, iconURL: 'https://cdn.discordapp.com/avatars/' + bot_id + '/' + bot_avatar })
                    .setDescription('Image generated with model: ' + check_string + ', seed: ' + seed)
                    .addFields(
                        { name: 'Prompt:', value: draw_prompt },
                        { name: 'Negative prompt', value: neg_prompt },
                        { name: 'Textual inversion', value: text_invs },
                        { name: 'Sampler', value: sampler },
                        { name: 'VAE', value: vae },
                        { name: 'Restore faces?', value: String(res_faces) },
                    )
                    .setImage('attachment://output.png')
                    .setTimestamp()
                    .setFooter({ text: 'Generated by ' + interaction.member.user.tag, iconURL: 'https://cdn.discordapp.com/avatars/' + interaction.member.id + '/' + interaction.member.user.avatar });
            interaction.editReply({ embeds: [exampleEmbed], files: [file] });
            interaction.get
        });
	},
};
