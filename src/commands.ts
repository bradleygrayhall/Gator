import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string,CommandHandler>

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error(`usage: ${cmdName} <username>`);
    }
    const username = args[0];
    setUser(username)
    console.log(`User ${username} has been set`);
}

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
 registry[cmdName] = handler;
}
export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const command = registry[cmdName];
    if (!command) {
        throw new Error(`no command found for ${cmdName}`)
    }
    command(cmdName,...args);
}
