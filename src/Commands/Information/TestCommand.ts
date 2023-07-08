import { Command } from "@/Structures/Command";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Just a simple command.'),
    isTest: true,
    run: async (client, interaction) => {
        interaction.channel?.send({
            content: '## Bugs'
        });
        interaction.channel?.send({
            content: '## Minor Bugs'
        });
        interaction.channel?.send({
            content: '## Major Bugs'
        });
    }
});