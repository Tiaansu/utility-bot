import { config } from "dotenv";
config();

import { Component } from "@/Structures/Component";
import { ButtonInteraction, ChannelType, EmbedBuilder, ForumChannel, TextBasedChannel, TextChannel, userMention } from "discord.js";
import { stripIndents } from "common-tags";
import Logger from "@/Utils/Logger";

const suggestionForumChannelId = process.env.ENVIRONMENT === 'dev' ? '1126780816408715264' : '1090911662342680666';
const suggestionListChannelId = process.env.ENVIRONMENT === 'dev' ? '1126799089703600138' : '1126095794471182377';

export default new Component<ButtonInteraction>({
    customId: 'priority-btn',
    run: async (client, interaction) => {
        if (process.env.ENVIRONMENT === 'prod') {
            if (
                interaction.guild?.roles.cache.get('934681107247538206')?.members.has(interaction.user.id) || 
                interaction.guild?.roles.cache.get('955285417006084126')?.members.has(interaction.user.id)
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
        (interaction.guild?.channels.cache.get(suggestionListChannelId) as TextBasedChannel).send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`New priority suggestion`)
                    .setDescription(stripIndents(`
                        **Suggested by:** ${userMention(suggestionData?.suggestedById!)}

                        **Title:** ${suggestionData?.suggestionTitle}
                        **Tags:** ${suggestionData?.suggestionType}

                        **Description:**
                        ${suggestionData?.suggestionDescription}

                        Jump to suggestion: ${suggestionData?.suggestionUrl}
                    `))
                    .setColor('Random')
            ]
        });

        const thread = (interaction.guild?.channels.cache.get(suggestionForumChannelId) as ForumChannel).threads.cache.get(suggestionData?.threadId!);
        await thread?.setName(`[PRIORITY] - ${thread.name}`);
        await thread?.setLocked(true);

        await client.utility.core.prisma.suggestions.delete({
            where: { suggestionId: suggestionId }
        });

        response.edit({
            content: 'This suggestion has been checked and are now marked as priority by the Community Directors.',
            embeds: [],
            components: []
        })
    }
})