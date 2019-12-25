const { Timer } = require("easytimer.js");
const dialog = require('dialog');
const doNotDisturb = require("@sindresorhus/do-not-disturb");
const {clearLineAndWrite} = require("../helpers/cli");
const {startCountdownTimer} = require("../helpers/timer");

const signature = "start [sessionSize] [restSize]";
const description = "start the timer";
function configure(yargs) {
    yargs.positional('sessionSize', {
        type: 'number',
        default: 25,
        describe: 'Duration of the session in minutes'
    }).positional("restSize", {
        type: 'number',
        default: 5,
        describe: 'Duration of the rest in minutes'
    })
}

async function run(argv) {
    const {sessionSize, restSize} = argv;
    console.log(`Starting timer for ${sessionSize}m`);

    const sessionTimer = new Timer();
    const restTimer = new Timer();

    await doNotDisturb.enable();
    startCountdownTimer(sessionTimer, sessionSize, async (eventName, event) => {
        if (eventName === "update") {
            return printCountdownToCli(event.timer);
        }

        if (eventName === "finish") {
            await doNotDisturb.disable();
            dialog.info("Good job! Take a moment to rest", "Mindful Timer", async () => {
                if (!restSize) {
                    return;
                }

                console.log(`\n\nStarting rest timer for ${sessionSize}m`);
                startCountdownTimer(restTimer, restSize, async (eventName, event) => {
                    if (eventName === "update") {
                        return printCountdownToCli(event.timer);
                    }

                    if (eventName === "finish") {
                        dialog.info("It's time to get back to work!", "Mindful Timer");
                    }
                });
            });
        }
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
