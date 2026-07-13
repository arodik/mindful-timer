import {getFileName, getSettingsDir} from "../helpers/settings.js";
import {readNdjson, appendNdjson, writeNdjson} from "../helpers/db.js";
import {getDataPath} from "./config.js";
import path from "path";
import fs from "fs";

function getDbPath(): string {
    return path.resolve(
        getSettingsDir(),
        getDataPath(),
        getFileName("db")
    );
}

export class DatabaseCollection {
    dbPath: string;

    static getDbPath(): string {
        return getDbPath();
    }

    static selectAll(): any[] {
        const filePath = getDbPath();
        const records = readNdjson(filePath);
        
        // Last-Write-Wins mapping to resolve session updates
        const resolvedMap: Record<string, any> = {};
        for (const record of records) {
            resolvedMap[record.id] = record;
        }

        return Object.values(resolvedMap);
    }

    static select(predicate: (item: any) => boolean): any[] {
        return this.selectAll().filter(predicate);
    }

    static compact(): void {
        const filePath = getDbPath();
        const resolved = this.selectAll();
        writeNdjson(filePath, resolved);
    }

    static getRawLineCount(): number {
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

    insert(record: any): void {
        appendNdjson(this.dbPath, record);
    }

    changeRecord(idOrCollection: string, mutatorOrId?: any, maybeMutator?: any): void {
        let targetId: string;
        let targetMutator: (record: any) => void;

        // Support both:
        // - changeRecord(id, mutator)
        // - changeRecord(collection, id, mutator)
        if (typeof mutatorOrId === "function") {
            targetId = idOrCollection;
            targetMutator = mutatorOrId;
        } else {
            targetId = mutatorOrId;
            targetMutator = maybeMutator;
        }

        const resolved = (this.constructor as typeof DatabaseCollection).selectAll();
        const record = resolved.find(item => item.id === targetId);
        if (!record) {
            return;
        }

        targetMutator(record);
        appendNdjson(this.dbPath, record);
    }

    remove(idOrCollection: string, maybeId?: string): void {
        let targetId: string;

        // Support both:
        // - remove(id)
        // - remove(collection, id)
        if (maybeId === undefined) {
            targetId = idOrCollection;
        } else {
            targetId = maybeId;
        }

        const resolved = (this.constructor as typeof DatabaseCollection).selectAll();
        const filtered = resolved.filter(item => item.id !== targetId);
        writeNdjson(this.dbPath, filtered);
    }
}
