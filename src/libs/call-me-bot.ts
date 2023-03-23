const url = require("url");
import axios from "axios";
import { keysTypes } from "./@types";

export async function sendWhatsapp(message: string, keys: keysTypes) {
  const { phone_key, apiKey_key } = keys;
  const phone = process.env[phone_key];
  const apiKey = process.env[apiKey_key];
  const urlCallMeBot = process.env.call_me_bot_url;
  const messageEnconded = new url.URLSearchParams({ text: message });

  const urlWhatsapp = `${urlCallMeBot}?phone=${phone}&${messageEnconded}&apikey=${apiKey}`;

  await axios
    .get(urlWhatsapp)
    .then((res) => {
      if (res.data.includes("color:red")) {
        throw new Error(
          `Error sending message for, ${phone}, ${apiKey}: /n/n ${res.data}`
        );
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
