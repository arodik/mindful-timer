import crypto from "node:crypto";
import {DatabaseCollection} from "./collection.js";
import {TimerSessionData, SessionInitData} from "../types.js";

export class TimerSession extends DatabaseCollection {
    static collection = "sessions";
    sessionId: string;
    data!: TimerSessionData;

    static create(sessionData: SessionInitData): TimerSession {
        const sessionId = crypto.randomBytes(4).toString("hex");

        const session = new TimerSession(sessionId);
        session.create(sessionData);

        return session;
    }

    constructor(sessionId: string) {
        super();
        this.sessionId = sessionId;
    }

    create(session: SessionInitData): void {
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

    finish(): void {
        this.changeRecord(TimerSession.collection, this.sessionId, (session: TimerSessionData) => {
            session.finished = true;
        });
    }

    interrupt(): void {
        this.changeRecord(TimerSession.collection, this.sessionId, (session: TimerSessionData) => {
            session.interruptTs = Date.now();
        });
    }

    remove(): void {
        super.remove(TimerSession.collection, this.sessionId);
    }
}
