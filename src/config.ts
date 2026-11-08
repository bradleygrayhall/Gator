import fs, { read } from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string,
    currentUserName?: string | undefined
}
function getConfigFilePath(): string {
    return path.join(os.homedir(),".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
    const savedSettings = JSON.stringify({db_url: cfg.dbUrl, current_user_name: cfg.currentUserName})
    fs.writeFileSync(getConfigFilePath(),savedSettings)
}
function validateConfig(rawConfig: any): Config {
    if (rawConfig === null) {
        throw new Error("Invalid configuration");
    }
    if (typeof rawConfig.db_url === "string" && (typeof rawConfig.current_user_name === "string" || typeof rawConfig.current_user_name === "undefined")) {
        return {dbUrl: rawConfig.db_url, currentUserName: rawConfig.current_user_name}
    }
    throw new Error("Invalid configuration");
}
export function readConfig(): Config {
    let file = fs.readFileSync(getConfigFilePath(),"utf-8");
    let rawConfig = JSON.parse(file);
    return validateConfig(rawConfig);
}

export function setUser(username: string) {
    let settings = readConfig();
    settings.currentUserName = username;
    writeConfig(settings)
}