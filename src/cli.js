const {startTimerCommand, configureStartCommand} = require("./commands/start");

async function runCli() {
    const yargs = require('yargs')
        .scriptName("mindful")
        .usage('$0 <cmd> [args]')
        .command('start [sessionSize]', 'start the timer', configureStartCommand, startTimerCommand)
        .help()
        .argv;
}

module.exports = {
    runCli,
};
