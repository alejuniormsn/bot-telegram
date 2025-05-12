const success = (message) => {
  return {
    success: true,
    statusCode: 200,
    message: message,
    error: [],
  };
};

module.exports = { success };
