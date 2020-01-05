const {getDb} = require("../helpers/db");

class Database {
    static selectAll() {
        return getDb().get(this.collection).value();
    }

    static select(predicate) {
        return getDb().get(this.collection)
            .filter(predicate)
            .value();
    }

    constructor() {
        this.db = getDb();
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

    remove(collection, id) {
        this.db.get(collection)
            .remove({ id })
            .write()
    }
}

module.exports = Database;
