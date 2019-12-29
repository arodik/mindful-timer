const fs = require("fs");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const {getSettingsDir, getDbFileName} = require("../helpers/settings");

class Database {
    constructor() {
        const settingsDir = getSettingsDir();
        const dbFilePath = path.join(settingsDir, getDbFileName());
        const adapter = new FileSync(dbFilePath);

        this.db = low(adapter);
        this.db.defaults({
            sessions: []
        }).write();
    }

    changeRecord(collection, id, mutator) {
        const session = this.db.get(collection)
            .find({id})
            .value();

        if (!session) {
            return;
        }

        mutator(session);

        this.db.write();
    }

}

module.exports = Database;
