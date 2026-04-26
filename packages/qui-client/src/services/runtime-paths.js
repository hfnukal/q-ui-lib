const path = require("node:path");

function getQuiClientRoot() {
  return path.resolve(__dirname, "..", "..");
}

function getQuiFeaturePackageRoot() {
  return path.resolve(getQuiClientRoot(), "..", "qui-feature");
}

module.exports = {
  getQuiClientRoot,
  getQuiFeaturePackageRoot,
};
