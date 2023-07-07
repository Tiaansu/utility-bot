import type { ModalSubmitInteraction } from "discord.js";
import Client from "@/Structures/Client";

export type ModalRunFunction = (
    client: Client,
    interaction: ModalSubmitInteraction
) => Promise<void> | void;