import fs from "fs";
import path from "path";
import os from "os";
import {resolvePath} from "../../root.js";

export function getSettingsDir() {
    const homeDir = os.homedir();
    const settingsDir = path.join(homeDir, ".mindful-timer");

    if (!fs.existsSync(settingsDir)) {
        fs.mkdirSync(settingsDir);
    }

    return settingsDir;
}

export function getFileName(baseName) {
    return fs.existsSync(resolvePath(".dev"))
        ? `${baseName}.dev.json`
        : `${baseName}.json`;
}
