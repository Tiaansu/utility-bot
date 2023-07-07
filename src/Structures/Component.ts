import type { MessageComponentInteraction } from "discord.js";
import type { RunFunction } from "@/Types/CommandTypes";
import type { ComponentOptions } from "@/Interfaces/ComponentOptions";

export class Component<Interaction extends MessageComponentInteraction> {
    public readonly customId: string;
    public run: RunFunction<Interaction>;

    public constructor({ customId, run }: ComponentOptions<Interaction>) {
        this.customId = customId;
        this.run = run;
    }
}