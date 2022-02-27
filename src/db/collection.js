import {getFileName, getSettingsDir} from "../helpers/settings.js";
import {openFileDb} from "../helpers/db.js";
import {getDataPath} from "./config.js";
import path from "path";
import _ from "lodash";

function getDb() {
    const pathToData = path.resolve(
        getSettingsDir(),
        getDataPath(),
        getFileName("db")
    );

    return openFileDb(pathToData, {
        sessions: []
    });
}

export class DatabaseCollection {
    static selectAll() {
        const db = getDb();

        return db.data[this.collection];
    }

    static select(predicate) {
        const db = getDb();

        const collection = db.data[this.collection];
        return collection.filter(predicate);
    }

    constructor() {
        this.db = getDb();
    }

    changeRecord(collection, id, mutator) {
        const collectionArray = this.db.data[collection];
        const session = collectionArray.find(item => item.id === id);

        if (!session) {
            return;
        }

        mutator(session);

        this.db.write();
    }

    remove(collection, id) {
        const collectionArray = this.db.data[collection];
        _.remove(collectionArray, item => item.id === id);

        this.db.write();
    }
}
