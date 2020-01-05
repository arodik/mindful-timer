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

function getFileName(baseName) {
    return fs.existsSync(path.resolve(__dirname, "../../.dev"))
        ? `${baseName}.dev.json`
        : `${baseName}.json`;
}

module.exports = {
    getFileName,
    getSettingsDir,
};
