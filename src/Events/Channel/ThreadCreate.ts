import { Event } from "@/Structures/Event";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, ForumChannel, roleMention} from "discord.js";

const roleId = process.env.ENVIRONMENT === 'dev' ? '1075715491932426240' : '1077220277588594718';

export default new Event(Events.ThreadCreate, async (client, channel) => {
    if (channel.parentId === '1126780816408715264') {
        const prioritizeBtn = new ButtonBuilder()
            .setCustomId('priority-btn')
            .setLabel('Prioritize')
            .setStyle(ButtonStyle.Primary);
        const prioritizeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(prioritizeBtn);

        const suggestedById = channel.ownerId;
        const suggestionTitle = channel.name;
        const suggestionDescription = await channel.fetchStarterMessage().then((msg) => msg?.content);
        const suggestionType = (channel.parent as ForumChannel).availableTags.filter((item) => channel.appliedTags.includes(item.id)).map((item) => item.name).join(', ') || 'no tags';
        const suggestionUrl = channel.url;
        const dateSuggested = Math.floor(Date.now() / 1000);

        const suggestion = await client.utility.core.suggestions.insertSuggestionData(
            suggestedById!,
            suggestionTitle,
            suggestionDescription!,
            suggestionType,
            suggestionUrl,
            dateSuggested
        );

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Notice for ${roleMention(roleId)} If you would like to prioritize this suggestion, please click the **Prioritize** button.`)
                    .setFooter({ text: suggestion })
                    .setColor('Green')
            ],
            components: [prioritizeRow]
        });
    }
});