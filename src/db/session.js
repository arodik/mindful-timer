const Database = require("./db");
const shortId = require("shortid");

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
        this.data = {
            id: this.sessionId,
            name: session.name,
            startTs: Date.now(),
            interruptTs: null,
            duration: session.size,
            finished: false,
            tags: session.tags,
        };

        this.db.get(TimerSession.collection)
            .push(this.data)
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

    remove() {
        super.remove(TimerSession.collection, this.sessionId);
    }
}

module.exports = TimerSession;
