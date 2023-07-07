import { EmbedBuilder, Events, time } from "discord.js";
import { Event } from "@/Structures/Event";
import chalk from "chalk";
import Logger from "@/Utils/Logger";

export default new Event(Events.InteractionCreate, async (client, interaction) => {
    console.log(interaction);
    // if (!client.isReady()) return;

    // if (interaction[0].)
});