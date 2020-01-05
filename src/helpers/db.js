const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

function openFileDb(path, defaults = {}) {
    const adapter = new FileSync(path);

    const db = low(adapter);
    db.defaults(defaults).write();

    return db;
}

module.exports = {
    openFileDb,
};
