import {TimerSession} from "../db/session.js";
import {DateTime} from "luxon";
import {Command, TimerSessionData} from "../types.js";
import {Argv} from "yargs";

const signature = "log [period]";
const description = "Show information about logged sessions";

function configure(yargs: Argv<any>): Argv<any> {
    return yargs.positional('period', {
        type: "string",
        default: "day",
        choices: ["day", "week", "month", "quarter", "year", "full"]
    });
}

export function getSessions(logPeriod: any): TimerSessionData[] {
    if (logPeriod === "full") {
        return TimerSession.selectAll() as TimerSessionData[];
    }

    return TimerSession.select((session: TimerSessionData) => {
        const start = DateTime.local().startOf(logPeriod);
        // Fallback/safety for startOf which can return null/invalid
        return session.startTs >= (start.isValid ? start.toMillis() : 0);
    }) as TimerSessionData[];
}

function formatStartDate(date: DateTime, period: string): string {
    if (period === "day") {
        return date.toFormat("T");
    }

    const isThisYear = date.year === DateTime.local().year;
    if (!isThisYear) {
        return date.toFormat("dd MMM yyyy T");
    }

    return date.toFormat("dd MMM T");
}

function getReadableDuration(session: TimerSessionData): string | number {
    const startDate = DateTime.fromMillis(session.startTs);
    const interruptDate = session.interruptTs
        ? DateTime.fromMillis(session.interruptTs)
        : null;
    const duration = interruptDate
        ? interruptDate.diff(startDate, "minutes").minutes
        : session.duration;

    return duration < 1 ? "<1" : duration;
}

function printSessionInfo(period: string): (session: TimerSessionData) => void {
    return (session: TimerSessionData) => {
        const finished = session.finished ? "✅" : "❌";
        const startDate = formatStartDate(DateTime.fromMillis(session.startTs), period);
        const readableDuration = getReadableDuration(session);
        const name = session.name || "Unnamed session";
        const tags = session.tags
            ? `(${session.tags.join(", ")})`
            : "";

        console.log(`${finished} ${startDate} - ${readableDuration}m - ${name} ${tags}`);
    };
}

async function run(argv: any): Promise<void> {
    const {period} = argv;
    const sessions = getSessions(period);

    sessions.reverse().forEach(printSessionInfo(period));
}

export const logCommand: Command = {
    signature,
    description,
    configure,
    run,
};
