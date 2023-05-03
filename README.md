# SD-Discord-bot
A discord bot for Stable Diffusion
## Dependencies
[Python](https://www.python.org/downloads/release/python-3106/) (tested with 3.10.6) <br />
[Node](https://nodejs.org/en) (tested with 18.15.0) <br />
NPM (tested with 9.6.1, comes with Node) <br />
Install NPM packages (run `npm install` inside SD-Discord-bot root directory) <br />
Install PIP packages (run `pip install -r requirements.txt` inside SD-Discord-bot root directory) <br /> <br />

[Automatic1111 installation of Stable Diffusion](https://github.com/AUTOMATIC1111/stable-diffusion-webui), launch with the following arguments: <br /> <br />
`--no-half-vae --api` <br /> <br />
optionally the `--xformers` argument can be used, this will automatically install xformers and enable it, to improve efficiency and lower VRAM usage. 
You can either manually input the launch arguments eacht time when running `webui-user.bat` or just edit the file and change the line: <br />
`set COMMANDLINE_ARGS=` to `set COMMANDLINE_ARGS= --xformers --no-half-vae --api` <br />

## Usage
Check whether Stable Diffusion is running on port 7860, if not you should change the port in the url variable in the `create_image_advanced.py` and `create_image.py` files. <br /> <br />
In `config.json` (which you most likely still have to make) you should put your configuration like so: <br />
```json
{
    "token": "<discord bot token here>",
    "clientId": "<discord application id here>",
    "guildId": "<guild id here (also known as discord server id)>"
    "models_path": "<models path here (example: C:\\Users\\uname\\Documents\\stable-diffusion-webui\\models)>"
}
```
Where token is referring to the bot token found in the discord developer portal in your application <br /> <br />
Where clientId is referring to the client id found in the discord developer portal in your application <br /> <br />
Where guildId is referring to the id of the Discord server, acquired by right clicking the drop-down menu of the server at the top left and then clicking `copy server id` (note that developer mode has to be enabled for this to work (settings > app settings > advanced > developer mode)) <br /> <br />
Where models_path is referring to the `models` directory inside the root directory of the stable diffusion web ui directory <br /> <br />

The commands can be deployed to the discord server by running `node deploy-commands.js`, run this every time you change the files in the `commands` directory. <br />
After the commands have been deployed the bot can be brought online and running by running `node index.js`, (mind that Stable Diffusion has to be running, or else the bot commands won't work).
