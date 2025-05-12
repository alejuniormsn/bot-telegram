const isValidEmail = (email) => {
  if (email) {
    const validate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return validate.test(email);
  } else {
    return false;
  }
};

module.exports = { isValidEmail };
