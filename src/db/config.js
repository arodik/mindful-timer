const path = require("path");
const {getSettingsDir, getFileName} = require("../helpers/settings");
const {openFileDb} = require("../helpers/db");

function getConfigDb() {
    const settingsPath = getSettingsDir();
    const pathToConfig = path.resolve(settingsPath, getFileName("config"));
    return openFileDb(pathToConfig, {
        dataPath: "./",
    });
}

function getDataPath() {
    const config = getConfigDb();
    return config.get("dataPath").value();
}

module.exports = {
    getDataPath,
};
