const { Configuration, OpenAIApi } = require("openai");
const { MessageMedia } = require("whatsapp-web.js");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const genrateImageBasedOnUserPromt = async (message) => {
  try {
    const response = await openai.createImage({
      prompt: message.body,
      n: 1,
      size: "1024x1024",
    });
    image_url = response.data.data[0].url;
    message.reply("Please wait we are genrating the image");
    const media = await MessageMedia.fromUrl(image_url);
    message.reply(media);
  } catch (err) {
    console.log(err.response?.data?.error);

    // if(err.data.error.message)
    // console.log(err.data.error.message);
    if (
      err.response?.data?.error?.message ===
      "Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system."
    ) {
      message.reply("Teri mummy ko btau ?");
    } else message.reply("Something went wrong our side");
  }
};

module.exports = genrateImageBasedOnUserPromt;
