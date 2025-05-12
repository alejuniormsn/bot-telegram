const badRequest = (message) => {
  return {
    success: false,
    statusCode: 400,
    message: [],
    error: [{ error: message ? message : "Invalid or missing parameter." }],
  };
};

const notFound = (message) => {
  return {
    success: false,
    statusCode: 404,
    message: [],
    error: [{ error: message ? message : "Not found, is not registered." }],
  };
};

const internalServerError = () => {
  return {
    success: false,
    statusCode: 500,
    message: [],
    error: [
      {
        error: "Server problems, please try again later.",
      },
    ],
  };
};

const unauthorized = () => {
  return {
    success: false,
    statusCode: 401,
    message: [],
    error: [
      {
        error: "Authorization has been refused for those credentials",
      },
    ],
  };
};

module.exports = { badRequest, notFound, internalServerError, unauthorized };
