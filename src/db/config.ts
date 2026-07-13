import path from "path";
import fs from "fs";
import {getFileName, getSettingsDir} from "../helpers/settings.js";

/**
 * Reads the config file to determine the data directory path.
 * If the config file does not exist, it creates it with defaults.
 * 
 * @returns {string} The path to the data directory.
 */
export function getDataPath(): string {
    const settingsPath = getSettingsDir();
    const pathToConfig = path.resolve(settingsPath, getFileName("config"));

    if (!fs.existsSync(pathToConfig)) {
        const defaultConfig = { dataPath: "./" };
        try {
            fs.writeFileSync(pathToConfig, JSON.stringify(defaultConfig, null, 4), "utf-8");
        } catch (e) {
            console.error("Failed to create default config file:", e);
        }
        return defaultConfig.dataPath;
    }

    try {
        const content = fs.readFileSync(pathToConfig, "utf-8");
        const config = JSON.parse(content);
        return config.dataPath || "./";
    } catch (e) {
        console.error("Failed to parse config file, using default dataPath './':", e);
        return "./";
    }
}
