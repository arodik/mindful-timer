import {getSessions, logCommand} from "./log.js";
import {Duration} from "luxon";
import {Command, TimerSessionData} from "../types.js";

const signature = "stats [period]";
const description = "Show statistics about logged sessions";
const configure = logCommand.configure;

interface StatsResult {
    totalTimeMinutes: number;
    count: number;
    totalTime: Duration;
    tags: string[];
}

interface InterruptedStatsResult extends StatsResult {
    realTimeMs: number;
    realTime: Duration;
}

function getObjectFromDuration(duration: Duration): any {
    return duration.shiftTo("hours", "minutes", "seconds").toObject();
}

function getTags(sessions: TimerSessionData[]): string[] {
    const allTags = sessions.flatMap(session => session.tags || []);
    return Array.from(new Set(allTags));
}

function getStats(sessions: TimerSessionData[]): StatsResult {
    const totalTimeMinutes = sessions.reduce((total, session) => total + session.duration, 0);

    return {
        totalTimeMinutes,
        count: sessions.length,
        totalTime: Duration.fromObject({minutes: totalTimeMinutes}),
        tags: getTags(sessions),
    };
}

function getInterruptedStats(sessions: TimerSessionData[]): InterruptedStatsResult {
    const stats = getStats(sessions);
    const realTimeMs = sessions.reduce((total, session) => {
        return total + ((session.interruptTs || 0) - session.startTs);
    }, 0);

    return {
        ...stats,
        realTimeMs,
        realTime: Duration.fromMillis(realTimeMs),
    };
}

function getPrettyDurationString(duration: Duration): string {
    const {hours, minutes, seconds} = getObjectFromDuration(duration);
    const parts = [];

    if (hours) {
        parts.push(`${hours}h`);
    }

    if (minutes) {
        parts.push(`${minutes}m`);
    }

    if (seconds) {
        parts.push(`${Math.floor(seconds)}s`);
    }

    return parts.length
        ? parts.join(" ")
        : "0";
}

function printTotalStats(finishedStats: StatsResult, interruptedStats: InterruptedStatsResult): void {
    const totalTimeLogged = finishedStats.totalTimeMinutes;
    const totalTimeInterruptedMs = interruptedStats.realTimeMs;

    const totalLogged = Duration.fromObject({minutes: totalTimeLogged});
    const totalLoggedWithInterrupted = Duration.fromObject({
        minutes: totalTimeLogged,
        milliseconds: totalTimeInterruptedMs
    });

    console.log(`Total time: ${getPrettyDurationString(totalLogged)}`);
    console.log(`Total time (with interrupted): ${getPrettyDurationString(totalLoggedWithInterrupted)}`);
    console.log();
}

function printStats(stats: StatsResult): void {
    console.log(`Sessions: ${stats.count}`);
    console.log(`Total time: ${getPrettyDurationString(stats.totalTime)}`);
    if (stats.tags.length) {
        console.log(`Tags: ${stats.tags.join(", ")}`);
    }
}

function printInterruptedStats(stats: InterruptedStatsResult): void {
    console.log(`Sessions: ${stats.count}`);

    if (stats.realTime) {
        console.log(`Total time logged: ${getPrettyDurationString(stats.realTime)}`);
    }

    if (stats.tags.length) {
        console.log(`Tags: ${stats.tags.join(", ")}`);
    }
}

async function run(argv: any): Promise<void> {
    const {period} = argv;
    const sessions = getSessions(period);

    const finished = sessions.filter(session => session.finished);
    const interrupted = sessions.filter(session => !session.finished && session.interruptTs);

    const finishedStats = getStats(finished);
    const interruptedStats = getInterruptedStats(interrupted);

    printTotalStats(finishedStats, interruptedStats);

    console.log("✅ Completed:");
    printStats(finishedStats);
    console.log();
    console.log("❌ Interrupted:");
    printInterruptedStats(interruptedStats);
}

export const statsCommand: Command = {
    signature,
    description,
    configure,
    run,
};
