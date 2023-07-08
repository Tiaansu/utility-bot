import { Component } from "@/Structures/Component";
import { 
    ButtonInteraction, 
    EmbedBuilder, 
    ForumChannel 
} from "discord.js";

const suggestionForumChannelId = process.env.ENVIRONMENT === 'dev' ? '1126780816408715264' : '1090911662342680666';

export default new Component<ButtonInteraction>({
    customId: 'suggestion-done-btn',
    run: async (client, interaction) => {
        if (process.env.ENVIRONMENT === 'prod') {
            if (
                !interaction.guild?.roles.cache.get('934681107247538206')?.members.has(interaction.user.id) &&
                !interaction.guild?.roles.cache.get('955285417006084126')?.members.has(interaction.user.id)
            ) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription('That button is not for you.').setColor('Red')
                    ]
                });
                return;
            }
        }

        const response = await interaction.deferUpdate();

        const suggestionId = interaction.message.embeds[0].footer?.text!;
        const suggestionData = await client.utility.core.suggestions.getSuggestionData(suggestionId);

        const thread = (interaction.guild?.channels.cache.get(suggestionForumChannelId) as ForumChannel).threads.cache.get(suggestionData?.threadId!);
        await thread?.setName(thread.name.replace('[PRIORITY]', '[DONE]'));

        await client.utility.core.prisma.suggestions.delete({
            where: { suggestionId }
        });

        response.edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Finished priority suggestion`)
                    .setDescription(interaction.message.embeds[0].description)
                    .setColor(interaction.message.embeds[0].color)
                    .setFooter(interaction.message.embeds[0].footer)
            ],
            components: []
        });
    }
})
