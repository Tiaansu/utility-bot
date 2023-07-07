import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { RunFunction, SlashCommand } from "@/Types/CommandTypes";
import { CommandOptions } from "@/Interfaces/CommandOptions";

export class Command {
    public readonly data: SlashCommand;
    public readonly isTest: boolean;
    public readonly cooldown?: number;
    public autocomplete?: RunFunction<AutocompleteInteraction>;
    public run?: RunFunction<ChatInputCommandInteraction>;

    public constructor({ data, isTest, cooldown, autocomplete, run }: CommandOptions) {
        this.data = data;
        this.isTest = isTest;
        this.cooldown = cooldown;
        this.autocomplete = autocomplete;
        this.run = run;
    }
}