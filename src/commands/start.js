const { Timer } = require("easytimer.js");
const dialog = require('dialog');
const doNotDisturb = require("@sindresorhus/do-not-disturb");
const {clearLineAndWrite} = require("../helpers/cli");

const signature = "start [sessionSize]";
const description = "start the timer";

function configure(yargs) {
    yargs.positional('sessionSize', {
        type: 'number',
        default: 25,
        describe: 'Duration of the session in minutes'
    })
    //     .positional("restSize", {
    //     type: 'number',
    //     default: 5,
    //     describe: 'Duration of the rest in minutes'
    // })
}

async function run(argv) {
    const {sessionSize} = argv;
    console.log(`Starting timer for ${sessionSize}m`);

    const sessionTimer = new Timer();

    await doNotDisturb.enable();
    sessionTimer.start({
        startValues: {minutes: sessionSize},
        countdown: true,
    });

    sessionTimer.addEventListener("secondsUpdated", (e) => {
        clearLineAndWrite("⏱  " + sessionTimer.getTimeValues().toString());
    });

    sessionTimer.addEventListener("targetAchieved", async function (e) {
        await doNotDisturb.disable();
        dialog.info('Good work! Take a moment to rest');
    });
}

module.exports = {
    startCommand: {
        signature,
        description,
        configure,
        run,
    }
};
