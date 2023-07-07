import type { ContextMenuCommandBuilder } from "discord.js";
import type { ContextMenuOptions } from "@/Interfaces/ContextMenuTypes";
import type { ContextMenuRunFunction, ContextMenuTypes } from "@/Types/ContextMenuTypes";

export class ContextMenu {
    public readonly data: ContextMenuCommandBuilder;
    public readonly isTest: boolean;
    public run: ContextMenuRunFunction<ContextMenuTypes>;

    public constructor({ data, isTest, run }: ContextMenuOptions) {
        this.data = data;
        this.isTest = isTest;
        this.run = run;
    }
}