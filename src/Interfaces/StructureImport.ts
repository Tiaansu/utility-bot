import type { ClientEvents, MessageComponentInteraction } from "discord.js";
import type { Event } from "@/Structures/Event";
import type { Command } from "@/Structures/Command";
import type { SubCommand } from "@/Structures/SubCommand";
import type { SubCommandGroup } from "@/Structures/SubCommandGroup";
import type { Component } from "@/Structures/Component";
import type { ContextMenu } from "@/Structures/ContextMenu";

export interface StructureImport<
    Structure extends
        | Event<keyof ClientEvents>
        | Command
        | SubCommand
        | SubCommandGroup
        | Component<MessageComponentInteraction>
        | ContextMenu

> {
    default: Structure;
}