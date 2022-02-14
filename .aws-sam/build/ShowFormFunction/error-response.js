module.exports = function errorResponse(body, corsOrigin) {
  return {
    statusCode: 500,
    body: String(body),
    headers: {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': corsOrigin
    }
  };
};
