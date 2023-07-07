import type { ChatInputCommandInteraction } from "discord.js";
import type { RunFunction } from "@/Types/CommandTypes";

export interface SubCommandOptions {
    subCommand: string;
    run: RunFunction<ChatInputCommandInteraction>;
};