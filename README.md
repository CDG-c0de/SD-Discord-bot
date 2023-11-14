# SD-Discord-bot
A discord bot for Stable Diffusion
## Dependencies
[Node](https://nodejs.org/en) (tested with 18.15.0) <br />
NPM (tested with 9.6.1, comes with Node) <br />
Install NPM packages (run `npm install` inside SD-Discord-bot root directory) <br />

[Automatic1111 installation of Stable Diffusion](https://github.com/AUTOMATIC1111/stable-diffusion-webui), launch with the following arguments: <br /> <br />
`--no-half-vae --api` <br /> <br />
optionally the `--xformers` argument can be used, this will automatically install xformers and enable it, to improve efficiency and lower VRAM usage. 
You can either manually input the launch arguments each time when running `webui-user.bat` or just edit the file and change the line: <br />
`set COMMANDLINE_ARGS=` to `set COMMANDLINE_ARGS= --xformers --no-half-vae --api` <br />

## Usage
In `config.json` (which you most likely still have to make) in the root directory of the repo you should put your configuration like so: <br />
```json
{
    "token": "<discord bot token here>",
    "clientId": "<discord application id here>",
    "guildId": "<guild id here (also known as discord server id)>",
    "models_path": "<models path here (example: C:\\Users\\uname\\Documents\\stable-diffusion-webui\\models)>",
    "sd_api_url": "<Stable Diffusion url (usually: http://127.0.0.1:7860)>"
}
```
Where token is referring to the bot token found in the discord developer portal in your application <br /> <br />
Where clientId is referring to the client id found in the discord developer portal in your application <br /> <br />
Where guildId is referring to the id of the Discord server, acquired by right clicking the drop-down menu of the server at the top left and then clicking `copy server id` (note that developer mode has to be enabled for this to work (settings > app settings > advanced > developer mode)) <br /> <br />
Where models_path is referring to the `models` directory inside the root directory of the stable diffusion web ui directory (escape backslashes with backslashes)<br /> <br />
Where sd_api_url is referring to the url that Stable Diffusion is running on, including port, Stable Diffusion ouputs this url in the terminal on launch <br /> <br />

The commands can be deployed to the discord server by running `node deploy-commands.js`, run this every time you change the files in the `commands` directory, or when you add/remove/change models/textual inversions in Stable Diffusion. <br />
After the commands have been deployed the bot can be brought online and running by running `node index.js`, (mind that Stable Diffusion has to be running, or else the bot commands won't work).
