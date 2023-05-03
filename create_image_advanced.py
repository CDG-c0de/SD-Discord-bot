import requests
import io
import base64
from PIL import Image, PngImagePlugin
import sys

def draw(check_string, vae, seed_inp, sampler, prompt, neg_prompt, rest_faces, text_inv):

    url = "http://127.0.0.1:7860"

    option_payload = {
        "sd_model_checkpoint": check_string,
        "sd_vae": vae
    }

    if rest_faces == 'true':
        rest_faces = True
    else:
        rest_faces = False

    requests.post(url=f'{url}/sdapi/v1/options', json=option_payload)

    payload = {
        "prompt": prompt,
        "negative_prompt": neg_prompt + ' ' + text_inv.split('.')[0],
        "steps": 30,
        "sampler_index": sampler,
        "seed": seed_inp,
        "restore_faces": rest_faces
    }

    response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)

    r = response.json()

    for i in r['images']:
        image = Image.open(io.BytesIO(base64.b64decode(i.split(",",1)[0])))
        print(r['info'].split('seed": ', 1)[1].split(',')[0])
        png_payload = {
            "image": "data:image/png;base64," + i
        }
        response2 = requests.post(url=f'{url}/sdapi/v1/png-info', json=png_payload)

        pnginfo = PngImagePlugin.PngInfo()
        pnginfo.add_text("parameters", response2.json().get("info"))
        image.save('output.png', pnginfo=pnginfo)

if __name__ == "__main__":
    draw(sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7], sys.argv[8])