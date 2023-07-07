import {
    BaseInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import Client from '@/Structures/Client';

export type SlashCommand = 
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubCommandGroup'>;

export type RunFunction <Interaction extends BaseInteraction> = (
    client: Client,
    interaction: Interaction
) => Promise<void> | void;