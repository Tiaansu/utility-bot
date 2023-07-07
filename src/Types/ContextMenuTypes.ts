import type {
    ContextMenuCommandInteraction,
    Interaction,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction
} from 'discord.js';
import Client from '@/Structures/Client';

export type ContextMenuTypes = 
    & ContextMenuCommandInteraction
    & UserContextMenuCommandInteraction
    | MessageContextMenuCommandInteraction
    & Interaction

export type ContextMenuRunFunction<ContextMenuType extends ContextMenuTypes> = (
    client: Client,
    interaction: ContextMenuType
) => Promise<void> | void;