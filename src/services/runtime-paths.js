const path = require("node:path");

function getQuiClientRoot() {
  return path.resolve(__dirname, "..", "..");
}

module.exports = {
  getQuiClientRoot,
};
