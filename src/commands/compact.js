import {TimerSession} from "../db/session.js";

const signature = "compact";
const description = "Compact and consolidate database history (removes duplicate update rows)";

function configure(yargs) {
    // No arguments needed
}

async function run() {
    const linesBefore = TimerSession.getRawLineCount();
    
    console.log("Compacting database...");
    TimerSession.compact();

    const linesAfter = TimerSession.getRawLineCount();
    const removedCount = linesBefore - linesAfter;

    console.log("Database compacted successfully!");
    console.log(`- Rows before: ${linesBefore}`);
    console.log(`- Rows after:  ${linesAfter}`);
    if (removedCount > 0) {
        console.log(`- Cleared ${removedCount} duplicate/obsolete update rows.`);
    } else {
        console.log("- Database was already clean.");
    }
}

export const compactCommand = {
    signature,
    description,
    configure,
    run,
};
