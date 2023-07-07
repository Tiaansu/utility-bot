import { Command } from "@/Structures/Command";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('A simple ping command.'),
    isTest: true,
    run: async (client, interaction) => {
        interaction.reply({
            content: `Hello there ${interaction.user}.`,
            ephemeral: true
        });
    }
});