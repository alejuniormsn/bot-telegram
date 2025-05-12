const greeting = () => {
  const hora = new Date().toLocaleTimeString("pt-BR", {
    hour: "numeric",
    hour12: false,
  });
  if (hora >= 0 && hora <= 5) {
    return "Boa madrugada";
  } else if (hora >= 6 && hora < 12) {
    return "Bom dia";
  } else if (hora >= 12 && hora < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
};

module.exports = { greeting };
