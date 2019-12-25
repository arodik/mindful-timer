#!/usr/bin/env node
const { Timer } = require("easytimer.js");
const dialog = require('dialog');
const doNotDisturb = require("@sindresorhus/do-not-disturb");

function clearLineAndWrite(text) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(text);
}

(async () => {
    const yargs = require('yargs')
        .scriptName("mindful")
        .usage('$0 <cmd> [args]')
        .command('start [sessionSize]', 'start the timer', (yargs) => {
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
        }, async function (argv) {
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
        })
        .help()
        .argv;
})();

