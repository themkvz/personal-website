const path = require("node:path");

module.exports = {
  prettyState: true,
  prettyDatafile: true,
  datafilesDirectoryPath: path.join(__dirname, "..", "src/lib/featurevisor"),
  datafileNamePattern: "datafile.json",
};
