const fs = require("fs");
const path = require("path");
const getHomeDir = require("home-dir");

function getSettingsDir() {
    const homeDir = getHomeDir();
    const settingsDir = path.join(homeDir, ".mindful-timer");

    if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir);
    }

    return settingsDir;
}

function getDbFileName() {
    return fs.existsSync(path.resolve(__dirname, "../../.dev"))
        ? "db.dev.json"
        : "db.json";
}

module.exports = {
    getSettingsDir,
    getDbFileName
};
