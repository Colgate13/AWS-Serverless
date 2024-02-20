"use strict";

const {
  promises: { readFile },
} = require("fs");

class Handler {
  constructor({ rekognitionService, translatorService }) {
    this.rekognitionService = rekognitionService;
    this.translatorService = translatorService;
  }

  async detectLabels(buffer) {
    const result = await this.rekognitionService
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const worlingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    let names = "";
    worlingItems.forEach((item, index) => {
      if (!item.Name) {
        return;
      }

      if (index === worlingItems.length - 1) {
        names += `and ${item.Name}.`;
      } else {
        names += `${item.Name}, `;
      }
    });

    return {
      names,
      worlingItems,
    };
  }

  async translateText(text) { 
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text: text,
    };

    const result = await this.translatorService.translateText(params).promise();

    return result.TranslatedText;
  }

  formatText(worlingItems) {
    const finalText = [];

    for (const item of worlingItems) {
      finalText.push(`I'm ${item.Confidence.toFixed(2)}% sure that's a ${item.Name}`);
    }

    return finalText.join("\n");
  }


  async main(event) {
    try {
      const imgBuffer = await readFile("./images/cat1.jpeg");

      const {
        names,
        worlingItems,
      } = await this.detectLabels(imgBuffer);

      const formatText = await this.formatText(worlingItems);
      const translatedText = await this.translateText(formatText);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `I'm ${names}`,
          result: translatedText,
        }),
      };
    } catch (error) {
      console.error("Internal Server Error", error);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}

// factory
const aws = require("aws-sdk");
const rekognition = new aws.Rekognition();
const translator = new aws.Translate();

const handler = new Handler({
  rekognitionService: rekognition,
  translatorService: translator,
});

module.exports.main = handler.main.bind(handler);
