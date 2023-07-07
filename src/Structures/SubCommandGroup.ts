import type { ChatInputCommandInteraction } from "discord.js";
import type { SubCommandGroupOptions } from "@/Interfaces/SubCommandGroupOptions";
import type { RunFunction } from "@/Types/CommandTypes";

export class SubCommandGroup {
    public readonly subCommandGroup: string;
    public run: RunFunction<ChatInputCommandInteraction>;

    public constructor({ subCommandGroup, run }: SubCommandGroupOptions) {
        this.subCommandGroup = subCommandGroup;
        this.run = run;
    }
}