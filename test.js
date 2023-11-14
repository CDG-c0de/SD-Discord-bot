var needle = require('needle');
const { models_path, token, sd_api_url } = require('./config.json');

needle.request('get', sd_api_url + "/sdapi/v1/samplers", null, function (error, res) {
    console.log(res.body[1]["name"]);
});