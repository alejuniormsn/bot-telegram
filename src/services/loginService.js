const axios = require("axios");
const env = require("./../../.env");

const login = async (phone) => {
  try {
    return await axios.post(`${env.BASE_URL}/login`, {
      phoneNumber: phone,
    });
  } catch (error) {
    throw new Error(`Failed to login: ${error.message}`);
  }
};

module.exports = { login };
