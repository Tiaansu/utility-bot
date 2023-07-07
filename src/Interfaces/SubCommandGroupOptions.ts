import type { ChatInputCommandInteraction } from "discord.js";
import type { RunFunction } from "@/Types/CommandTypes";

export interface SubCommandGroupOptions {
    subCommandGroup: string;
    run: RunFunction<ChatInputCommandInteraction>;
};