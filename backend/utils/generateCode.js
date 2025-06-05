// backend/utils/generateCode.js
module.exports = function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric code
};
