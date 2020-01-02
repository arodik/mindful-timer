const {DateTime} = require("luxon");
const TimerSession = require("../db/session");

const signature = "log [period]";
const description = "Show information about logged sessions";

function configure(yargs) {
    yargs.positional('period', {
        type: "string",
        default: "day",
        choices: ["day", "week", "month", "quarter", "year", "full"]
    })
}

function getSessions(logPeriod) {
    if (logPeriod === "full") {
        return TimerSession.selectAll();
    }

    return TimerSession.select(session => {
        return session.startTs >= DateTime.local().startOf(logPeriod).ts;
    });
}

function formatStartDate(date, period) {
    if (period === "day") {
        return date.toFormat("T");
    }

    const isThisYear = date.year === DateTime.local().year;
    if (!isThisYear) {
        return date.toFormat("dd MMM yyyy T");
    }

    return date.toFormat("dd MMM T");
}

function getReadableDuration(session) {
    const startDate = DateTime.fromMillis(session.startTs);
    const interruptDate = session.interruptTs
        ? DateTime.fromMillis(session.interruptTs)
        : null;
    const duration = interruptDate
        ? interruptDate.diff(startDate, "minutes").minutes
        : session.duration;

    return duration < 1 ? "<1" : duration;
}

function printSessionInfo(period) {
    return session => {
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

async function run(argv) {
    const {period} = argv;
    const sessions = getSessions(period);

    sessions.reverse().forEach(printSessionInfo(period));
}

module.exports = {
    logCommand: {
        signature,
        description,
        configure,
        run,
    }
};
