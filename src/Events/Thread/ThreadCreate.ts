import { Event } from "@/Structures/Event";
import { stripIndents } from "common-tags";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, ForumChannel, roleMention, userMention} from "discord.js";

const bugReportParentId = process.env.ENVIRONMENT === 'dev' ? '1127047439195582524' : '1090931029608509490';
const suggestionParentId = process.env.ENVIRONMENT === 'dev' ? '1126780816408715264' : '1090911662342680666';
const roleId = process.env.ENVIRONMENT === 'dev' ? '1075715491932426240' : '1077220277588594718';

export default new Event(Events.ThreadCreate, async (client, channel) => {

    // Suggestion
    if (channel.parentId === suggestionParentId) {
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
        const threadId = channel.id;
        const dateSuggested = Math.floor(Date.now() / 1000);

        const suggestion = await client.utility.core.suggestions.insertSuggestionData(
            suggestedById!,
            suggestionTitle,
            suggestionDescription!,
            suggestionType,
            suggestionUrl,
            threadId,
            dateSuggested
        );

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Notice for ${roleMention(roleId)}. If you would like to prioritize this suggestion, please click the **Prioritize** button.`)
                    .setFooter({ text: suggestion })
                    .setColor('Green')
            ],
            components: [prioritizeRow]
        });
    }

    if (channel.parentId === bugReportParentId) {
        const bugBtn = new ButtonBuilder()
            .setCustomId('bug-btn')
            .setLabel('Mark as bug')
            .setStyle(ButtonStyle.Secondary);
        
        const minorBugBtn = new ButtonBuilder()
            .setCustomId('minor-bug-btn')
            .setLabel('Mark as minor bug')
            .setStyle(ButtonStyle.Secondary);

        const majorBugBtn = new ButtonBuilder()
            .setCustomId('major-bug-btn')
            .setLabel('Mark as major bug')
            .setStyle(ButtonStyle.Secondary);

        const closeBugReportBtn = new ButtonBuilder()
            .setCustomId('close-bug-report-btn')
            .setLabel('Close bug report')
            .setStyle(ButtonStyle.Secondary);

        const bugReportRow = new ActionRowBuilder<ButtonBuilder>().addComponents(bugBtn, minorBugBtn, majorBugBtn, closeBugReportBtn);

        const bugReporterId = channel.ownerId;
        const bugReportTitle = channel.name;
        const bugReportDescription = await channel.fetchStarterMessage().then((msg) => msg?.content);
        const bugReportUrl = channel.url;
        const threadId = channel.id;
        const dateReported = Math.floor(Date.now() / 1000);

        const bugReport = await client.utility.core.bugReports.insertBugReportData(
            bugReporterId!,
            bugReportTitle,
            bugReportDescription!,
            bugReportUrl,
            threadId,
            dateReported
        );

        channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`Notice for ${roleMention(roleId)}. Please click the button according to the type or level of the bug.`)
                    .setFooter({ text: bugReport })
            ],
            components: [bugReportRow]
        })
    }
});