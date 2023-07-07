import type { ChatInputCommandInteraction } from "discord.js";
import type { RunFunction } from "@/Types/CommandTypes";
import type { SubCommandOptions } from "@/Interfaces/SubCommandOptions";

export class SubCommand {
    public readonly subCommand: string;
    public run: RunFunction<ChatInputCommandInteraction>;

    public constructor({ subCommand, run }: SubCommandOptions) {
        this.subCommand = subCommand;
        this.run = run;
    }
}