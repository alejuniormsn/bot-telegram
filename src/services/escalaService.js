const axios = require("axios");
const env = require("./../../.env");

const getEscala = async (_matricula, _accessToken) => {
  try {
    return await axios.get(`${env.BASE_URL}/consultaescala/${_matricula}`, {
      headers: { Authorization: `Bearer ${_accessToken}` },
    });
  } catch (error) {
    throw new Error(`Failed to get escala: ${error.message}`);
  }
};

module.exports = { getEscala };
