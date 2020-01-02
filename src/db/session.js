const Database = require("./db");
const shortId = require("shortid");
const {getDb} = require("../helpers/db");

class TimerSession extends Database {
    static collection = "sessions";
    static create(sessionData) {
        const sessionId = shortId.generate();

        const session = new TimerSession(sessionId);
        session.create(sessionData);

        return session;
    }

    constructor(sessionId) {
        super();
        this.sessionId = sessionId;
    }

    create(session) {
        this.db.get(TimerSession.collection)
            .push({
                id: this.sessionId,
                name: session.name,
                startTs: Date.now(),
                interruptTs: null,
                duration: session.size,
                finished: false,
                tags: session.tags,
            })
            .write();
    }

    finish() {
        this.changeRecord(TimerSession.collection, this.sessionId, (session) => {
            session.finished = true;
        });
    }

    interrupt() {
        this.changeRecord(TimerSession.collection, this.sessionId, (session) => {
            session.interruptTs = Date.now();
        });
    }
}

module.exports = TimerSession;
