const fs = require("fs");
const path = require("path");
const config = require("../config");
const createDefaultData = require("./defaultData");

function ensureParentDirectory(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readDb() {
  ensureParentDirectory(config.dataFile);

  if (!fs.existsSync(config.dataFile)) {
    const initialData = createDefaultData();
    writeDb(initialData);
    return initialData;
  }

  const raw = fs.readFileSync(config.dataFile, "utf-8");
  return JSON.parse(raw);
}

function writeDb(data) {
  ensureParentDirectory(config.dataFile);

  const nextData = {
    ...data,
    metadata: {
      ...(data.metadata || {}),
      updatedAt: new Date().toISOString()
    }
  };

  fs.writeFileSync(config.dataFile, JSON.stringify(nextData, null, 2));
  return nextData;
}

function resetDb() {
  const initialData = createDefaultData();
  writeDb(initialData);
  return initialData;
}

module.exports = {
  readDb,
  writeDb,
  resetDb
};
