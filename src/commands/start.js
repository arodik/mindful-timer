import {startCountdownTimer} from "../helpers/timer.js";
import {TimerSession} from "../db/session.js";
import {clearLineAndWrite} from "../helpers/cli.js";
import {getDndProvider} from "../dnd/index.js";
import {Timer} from "easytimer.js";
import dialog from "dialog";

const signature = "start [sessionSize]";
const description = "Start the timer";
function configure(yargs) {
    yargs.positional('sessionSize', {
        type: 'number',
        default: 25,
        describe: 'Duration of the session in minutes'
    }).option("n", {
        alias: "name",
        type: "string",
        describe: "Name of the session",
    }).option("t", {
        alias: "tags",
        type: "array",
        describe: "List of tags separated by whitespace"
    })
}

async function run(argv) {
    const {name, sessionSize, tags} = argv;
    console.log(`Starting timer for ${sessionSize}m`);

    const sessionTimer = new Timer();
    const session = TimerSession.create({
        name,
        tags,
        size: sessionSize,
    });

    const doNotDisturb = getDndProvider();
    doNotDisturb.enable();
    startCountdownTimer(sessionTimer, sessionSize, async (eventName, event) => {
        if (eventName === "update") {
            return printTimerValue(event.timer);
        }

        if (eventName === "finish") {
            session.finish();
            doNotDisturb.disable();
            printTimerSummary(event);
            dialog.info("Good job! Take a moment to rest", "Mindful Timer");
        }
    });

    process.on('SIGINT', handleKeyboardInterrupt(session));
}

function printTimerValue(timer) {
    clearLineAndWrite("⏱  " + timer.getTimeValues().toString());
}

function printTimerSummary(summary) {
    const timeFormat = "HH:mm:ss";
    const startedAt = summary.startedAt.toFormat(timeFormat);
    const endedAt = summary.endedAt.toFormat(timeFormat);

    clearLineAndWrite(`✅ ${startedAt} - ${endedAt}\n`);
}

function handleKeyboardInterrupt(session) {
    return function () {
        const timeSpendSeconds = (Date.now() - session.data.startTs) / 1000;

        console.log("\nStopping...");
        if (timeSpendSeconds <= 10) {
            console.log("\nSession won't be tracked");
            session.remove();
        } else {
            session.interrupt();
        }

        getDndProvider().disable();

        process.exit(0);
    };
}

export const startCommand = {
    signature,
    description,
    configure,
    run,
};
