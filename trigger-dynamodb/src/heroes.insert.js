const uuid = require("node:crypto").randomUUID;
const Joi = require("@hapi/joi");
const decoratorValidator = require("./util/decoratorValidator");
const EnumParams = require("./util/EnumParams");

class Handler {
  constructor({
    dynamoDbService,
  }) {
    this.dynamoDbService = dynamoDbService;
    this.dynamodbTable = process.env.DYNAMODB_TABLE;
  }

  static validator() {
    return Joi.object({
      name: Joi.string().max(100).min(2).required(),
      power: Joi.string().max(20).min(2).required(),
    });
  }

  prepareData(data) { 
    const params = {
      TableName: this.dynamodbTable,
      Item: {
        id: uuid(),
        ...data,
        createAt: new Date().toISOString(),
      }
    };

    return params;
  }

  async insertItem(params) { 
    return this.dynamoDbService.put(params).promise();
  }

  handlerSUCCESS(data) {
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  }

  handlerERROR(data) {
    return {
      statusCode: data.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: 'Couldn\'t create item!',
    };
  }

  async main(event) {
    try {
      const data =event.body;
      const dbParms = this.prepareData(data);
      
      await this.insertItem(dbParms);

      return this.handlerSUCCESS(dbParms.Item);
    } catch (error) {
      console.error("Error", error.stack);
      return this.handlerERROR({
        statusCode: 500,
      });
    }
  }
}

//factory
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const handler = new Handler({
  dynamoDbService: dynamoDB,
});

module.exports = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  EnumParams.ARG_TYPE.BODY
);