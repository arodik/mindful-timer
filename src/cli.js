const {startCommand} = require("./commands/start");
const {logCommand} = require("./commands/log");
const {statsCommand} = require("./commands/stats");

async function runCli() {
    const yargs = require('yargs')
        .scriptName("mindful-timer")
        .usage('$0 <cmd> [args]')
        .command(startCommand.signature, startCommand.description, startCommand.configure, startCommand.run)
        .command(logCommand.signature, logCommand.description, logCommand.configure, logCommand.run)
        .command(statsCommand.signature, statsCommand.description, statsCommand.configure, statsCommand.run)
        .help()
        .argv;
}

module.exports = {
    runCli,
};
