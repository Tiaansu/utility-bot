import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { RunFunction, SlashCommand } from "@/Types/CommandTypes";

export interface CommandOptions {
    data: SlashCommand;
    isTest: boolean;
    cooldown?: number;
    autocomplete?: RunFunction<AutocompleteInteraction>;
    run?: RunFunction<ChatInputCommandInteraction>;
}