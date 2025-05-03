const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    console.error('Hash error:', err);
    throw err;
  }
}

async function comparePassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    console.error('matching error:', err);
    throw err;
  }
}

module.exports = {
  hashPassword,
  comparePassword
};
