const axios = require("axios");
const env = require("./../../.env");

const getHoleriteByMatricula = async (_matricula, _dataComp, _accessToken) => {
  try {
    return await axios.get(
      `${env.BASE_URL}/holerite?chapa=${_matricula}&dataComp=${_dataComp}`,
      { headers: { Authorization: `Bearer ${_accessToken}` } }
    );
  } catch (error) {
    throw new Error(`Failed to get holerite: ${error.message}`);
  }
};

const getDocumentDownload = async (_fileLink) => {
  try {
    return await axios.get(_fileLink, { responseType: "arraybuffer" });
  } catch (error) {
    throw new Error(`Failed to document download: ${error.message}`);
  }
};

const getIsManager = async (_matricula, _accessToken) => {
  try {
    return await axios.get(`${env.BASE_URL}/manager?chapa=${_matricula}`, {
      headers: { Authorization: `Bearer ${_accessToken}` },
    });
  } catch (error) {
    throw new Error(`Failed to get holerite: ${error.message}`);
  }
};

const getEmployeeForm = async (_matricula, _period, _accessToken) => {
  try {
    return await axios.get(
      `${env.BASE_URL}/employee-form?chapa=${_matricula}&period=${_period}`,
      {
        headers: { Authorization: `Bearer ${_accessToken}` },
      }
    );
  } catch (error) {
    throw new Error(`Failed to get holerite: ${error.message}`);
  }
};

module.exports = {
  getHoleriteByMatricula,
  getIsManager,
  getEmployeeForm,
  getDocumentDownload,
};
