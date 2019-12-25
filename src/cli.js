const {startCommand} = require("./commands/start");

async function runCli() {
    const yargs = require('yargs')
        .scriptName("mindful-timer")
        .usage('$0 <cmd> [args]')
        .command(startCommand.signature, startCommand.description, startCommand.configure, startCommand.run)
        .help()
        .argv;
}

module.exports = {
    runCli,
};
