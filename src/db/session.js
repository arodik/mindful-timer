import crypto from "node:crypto";
import {DatabaseCollection} from "./collection.js";

export class TimerSession extends DatabaseCollection {
    static collection = "sessions";
    static create(sessionData) {
        const sessionId = crypto.randomBytes(4).toString("hex");

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

        this.insert(this.data);
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
