const bcrypt = require("bcrypt");

const passwordHash = async password => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

module.exports = passwordHash;
