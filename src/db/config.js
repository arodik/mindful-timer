import path from "path";
import {openFileDb} from "../helpers/db.js";
import {getFileName, getSettingsDir} from "../helpers/settings.js";

function getConfigDb() {
    const settingsPath = getSettingsDir();
    const pathToConfig = path.resolve(settingsPath, getFileName("config"));
    return openFileDb(pathToConfig, {
        dataPath: "./",
    });
}

export function getDataPath() {
    const config = getConfigDb();
    return config.data.dataPath;
}
