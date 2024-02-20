async function handler(event, context) {
  console.log('event', event);
  console.log('context', context);

  console.log('Ambient...', JSON.stringify(process.env, null, 2));

  return {
    statusCode: 200,
    controler: 1,
    body: JSON.stringify({ message: 'Hello, World!' }),
  };
}

module.exports = { handler };