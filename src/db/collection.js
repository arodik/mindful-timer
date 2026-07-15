import { getFileName, getSettingsDir } from "../helpers/settings.js";
import { readNdjson, appendNdjson, writeNdjson } from "../helpers/db.js";
import { getDataPath } from "./config.js";
import path from "path";
import fs from "fs";

let isMigratedChecked = false;

export function migrateDatabaseIfNeeded() {
    if (isMigratedChecked) {
        return;
    }
    isMigratedChecked = true;

    const ndjsonPath = getDbPath();
    if (fs.existsSync(ndjsonPath)) {
        return;
    }

    const oldDbPath = path.resolve(
        getSettingsDir(),
        getDataPath(),
        getFileName("db", "json")
    );
    if (fs.existsSync(oldDbPath)) {
        try {
            const content = fs.readFileSync(oldDbPath, "utf-8");
            const oldData = JSON.parse(content.trim());
            if (oldData && Array.isArray(oldData.sessions)) {
                const contentNdjson = oldData.sessions.map(item => JSON.stringify(item)).join("\n") + "\n";
                fs.mkdirSync(path.dirname(ndjsonPath), { recursive: true });
                fs.writeFileSync(ndjsonPath, contentNdjson, "utf-8");
                console.log(`Migrating database from the legacy format...`);
            }
        } catch (e) {
            console.error(`Failed to migrate old database at ${oldDbPath}:`, e);
        }
    }
}

function getDbPath() {
    return path.resolve(
        getSettingsDir(),
        getDataPath(),
        getFileName("db", "ndjson")
    );
}

export class DatabaseCollection {
    static getDbPath() {
        return getDbPath();
    }

    static selectAll() {
        const filePath = getDbPath();
        const records = readNdjson(filePath);

        // Last-Write-Wins mapping to resolve session updates
        const resolvedMap = {};
        for (const record of records) {
            resolvedMap[record.id] = record;
        }

        return Object.values(resolvedMap);
    }

    static select(predicate) {
        return this.selectAll().filter(predicate);
    }

    static compact() {
        const filePath = getDbPath();
        const resolved = this.selectAll();
        writeNdjson(filePath, resolved);
    }

    static getRawLineCount() {
        const filePath = getDbPath();
        if (!fs.existsSync(filePath)) {
            return 0;
        }
        const content = fs.readFileSync(filePath, "utf-8");
        return content.split("\n").filter(line => line.trim() !== "").length;
    }

    constructor() {
        this.dbPath = getDbPath();
    }

    insert(record) {
        appendNdjson(this.dbPath, record);
    }

    changeRecord(collection, id, mutator) {
        // Support both (collection, id, mutator) and (id, mutator) signatures
        let targetId = id;
        let targetMutator = mutator;
        if (typeof id === "function") {
            targetMutator = id;
            targetId = collection;
        }

        const resolved = this.constructor.selectAll();
        const record = resolved.find(item => item.id === targetId);
        if (!record) {
            return;
        }

        targetMutator(record);
        appendNdjson(this.dbPath, record);
    }

    remove(collection, id) {
        // Support both (collection, id) and (id) signatures
        let targetId = id;
        if (id === undefined) {
            targetId = collection;
        }

        const resolved = this.constructor.selectAll();
        const filtered = resolved.filter(item => item.id !== targetId);
        writeNdjson(this.dbPath, filtered);
    }
}
