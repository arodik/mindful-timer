const Database = require("./db");
const shortid = require("shortid");

class TimerSession extends Database {
    static create(session) {
        const collectionName = "sessions";
        const sessionId = shortid.generate();

        return new TimerSession(collectionName, sessionId, session);
    }

    constructor(collectionName, sessionId, session) {
        super();
        this.sessionId = sessionId;
        this.collection = collectionName;

        this.db.get(collectionName)
            .push({
                id: sessionId,
                name: session.name,
                startTs: Date.now(),
                interruptTs: null,
                duration: session.size,
                finished: false,
            })
            .write();
    }

    finish() {
        this.changeRecord(this.collection, this.sessionId, (session) => {
            session.finished = true;
        });
    }

    interrupt() {
        this.changeRecord(this.collection, this.sessionId, (session) => {
            session.interruptTs = Date.now();
        });
    }
}

module.exports = TimerSession;
