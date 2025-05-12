const convertValue = (value) => {
  const result =
    value.substring(0, value.length - 2) +
    "." +
    value.substring(value.length - 2, value.length);
  return parseFloat(result);
};

const convertValueRef = (value) => {
  const result = value.replace(",", ".");
  return parseFloat(result);
};

const currency = (value) => {
  const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
};
// 2024-09-09T00:00:00 => 09/09/2024
const keepStr = (date) => {
  if (date) {
    const str = date.split("-");
    return `${str[2].slice(0, 2)}/${str[1]}/${str[0]}`;
  } else {
    return "";
  }
};

// 2024-09-09T06:22:00 => 09/09/2024 às 06:22:00
const keepStrWithHour = (date) => {
  if (date) {
    const str = date.split("-");
    return `${str[2].slice(0, 2)}/${str[1]}/${str[0]} às ${str[2].slice(3, 8)}`;
  } else {
    return "";
  }
};

// 2024-09-09T06:22:00 => 09/09/2024 às 06:22:00
const keepStrOnlyHour = (date) => {
  if (date) {
    const str = date.split("-");
    return `${str[2].slice(3, 8)} hs`;
  } else {
    return "";
  }
};

// 06022024 => 06/02/2024
const formatDate = (str) => {
  return (
    str.substring(0, 2) + "/" + str.substring(2, 4) + "/" + str.substring(4, 8)
  );
};

// 022024 => 02/2024
const formatDateComp = (str) => {
  return str.substring(0, 2) + "/" + str.substring(2, 6);
};

// 022024
const validateItem = (str) => {
  if (Number(str.substring(0, 2) > 12) || str.substring(0, 2) <= 0) {
    return false;
  }
  if (Number(str.substring(2, 6) <= 2023)) {
    return false;
  }
  return true;
};

const cleanNumber = (str) => {
  return str.slice(-9);
};

const reduceSize = (str) => {
  const dataBlock = str.split(" ");
  const firstWord = dataBlock[0];
  const lastWord = dataBlock[dataBlock.length - 1];
  return `${firstWord} ${lastWord}`;
};

const dateNow = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

module.exports = {
  convertValue,
  convertValueRef,
  dateNow,
  reduceSize,
  cleanNumber,
  validateItem,
  formatDate,
  formatDateComp,
  currency,
  keepStr,
  keepStrWithHour,
  keepStrOnlyHour,
};
