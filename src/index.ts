import { CommandsRegistry, handlerLogin, registerCommand, runCommand } from "./commands";


async function main() {
    const commands: CommandsRegistry = {}
    registerCommand(commands,"login",handlerLogin);
    const cliArgs = process.argv.slice(2);
    if (cliArgs.length === 0) {
        console.error("error missing command");
        process.exit(1);
    }
    const [command, ...args] = cliArgs;
    try {
        await runCommand(commands,command,...args);
    } catch (err) {
        console.error(err instanceof Error ? err.message : err);
        process.exit(0);
    }
}

main();