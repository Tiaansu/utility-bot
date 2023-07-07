import type { ContextMenuCommandBuilder } from "discord.js";
import type { ContextMenuTypes, ContextMenuRunFunction } from "@/Types/ContextMenuTypes";

export interface ContextMenuOptions {
    data: ContextMenuCommandBuilder;
    isTest: boolean;
    run: ContextMenuRunFunction<ContextMenuTypes>;
}