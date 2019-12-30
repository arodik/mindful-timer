const { Timer } = require("easytimer.js");
const dialog = require("dialog");
const doNotDisturb = require("@sindresorhus/do-not-disturb");
const {clearLineAndWrite} = require("../helpers/cli");
const {startCountdownTimer} = require("../helpers/timer");
const TimerSession = require("../db/session");

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

    await doNotDisturb.enable();
    startCountdownTimer(sessionTimer, sessionSize, async (eventName, event) => {
        if (eventName === "update") {
            return printCountdownToCli(event.timer);
        }

        if (eventName === "finish") {
            session.finish();
            await doNotDisturb.disable();
            dialog.info("Good job! Take a moment to rest", "Mindful Timer");
        }
    });

    process.on('SIGINT', function() {
        session.interrupt();
        process.exit(0);
    });
}

function printCountdownToCli(timer) {
    clearLineAndWrite("⏱  " + timer.getTimeValues().toString());
}

module.exports = {
    startCommand: {
        signature,
        description,
        configure,
        run,
    }
};
