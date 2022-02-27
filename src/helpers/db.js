import { LowSync, JSONFileSync } from 'lowdb';

export function openFileDb(path, defaults = {}) {
    const adapter = new JSONFileSync(path);

    const db = new LowSync(adapter);
    db.read();

    if (!db.data) {
        console.log(path, "Db data is empty, fill with defaults...");
        db.data = db.data || defaults;
        db.write();
    }

    return db;
}
