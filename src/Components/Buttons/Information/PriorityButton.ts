import { config } from "dotenv";
config();

import { Component } from "@/Structures/Component";
import { ButtonInteraction, EmbedBuilder, TextBasedChannel, userMention } from "discord.js";
import { stripIndents } from "common-tags";

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

        if (process.env.ENVIRONMENT === 'dev') {
            const message = interaction.message.embeds[0];
            const suggestionData = await client.utility.core.suggestions.getSuggestionData(message.footer?.text!);
            (interaction.guild?.channels.cache.get('1126799089703600138') as TextBasedChannel).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`New priority suggestion`)
                        .setDescription(stripIndents(`
                            Suggested by: ${userMention(suggestionData?.suggestedById!)}

                            Title: ${suggestionData?.suggestionTitle}
                            Description: ${suggestionData?.suggestionDescription}
                            Tags: ${suggestionData?.suggestionType}

                            Jump to suggestion: ${suggestionData?.suggestionUrl}
                        `))
                        .setColor('Random')
                ]
            });
        }

        interaction.reply({
            content: 'This suggestion are now listed as one of the priority.',
            ephemeral: true
        });
    }
})