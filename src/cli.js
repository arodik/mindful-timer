import {startCommand} from "./commands/start.js";
import {logCommand} from "./commands/log.js";
import {statsCommand} from "./commands/stats.js";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';

export async function runCli() {
    yargs(hideBin(process.argv))
        .usage('$0 <cmd> [args]')
        .command(startCommand.signature, startCommand.description, startCommand.configure, startCommand.run)
        .command(logCommand.signature, logCommand.description, logCommand.configure, logCommand.run)
        .command(statsCommand.signature, statsCommand.description, statsCommand.configure, statsCommand.run)
        .help()
        .demandCommand(1, "Please, select a command")
        .argv;
}
