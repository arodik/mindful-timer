const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const {getSettingsDir, getDbFileName} = require("../helpers/settings");

function getDb() {
    const settingsDir = getSettingsDir();
    const dbFilePath = path.join(settingsDir, getDbFileName());
    const adapter = new FileSync(dbFilePath);

    const db = low(adapter);
    db.defaults({
        sessions: []
    }).write();

    return db;
}

module.exports = {
    getDb,
};
