const decoratorValidator = (fn, schema, argsType) => {
  return async function (event) {
    const data = JSON.parse(event[argsType]);
    if (!data) {
      return {
        statusCode: 400,
        body: 'Invalid data',
      };
    }

    const { error, value } = await schema.validate(data, { abortEarly: false });

    // adjust the event to the new value
    event[argsType] = value;

    // arguments is a all the arguments that the function receives
    if (!error) return fn(event, arguments);

    return {
      statusCode: 422,
      body: error.message,
    }
  };
}

module.exports = decoratorValidator;