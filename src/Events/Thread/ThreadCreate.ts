import Client from "@/Structures/Client";
import { Event } from "@/Structures/Event";
import { stripIndents } from "common-tags";
import { ActionRowBuilder, AnyThreadChannel, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, ForumChannel, roleMention, userMention} from "discord.js";

const bugReportParentId = process.env.ENVIRONMENT === 'dev' ? '1127047439195582524' : '1090931029608509490';
const suggestionParentId = process.env.ENVIRONMENT === 'dev' ? '1126780816408715264' : '1090911662342680666';
const roleId = process.env.ENVIRONMENT === 'dev' ? '1075715491932426240' : '1077220277588594718';

export default new Event(Events.ThreadCreate, async (client: Client, thread: AnyThreadChannel<boolean>, newlyCreated: boolean) => {

    // Suggestion
    if (thread.parentId === suggestionParentId) {
        const prioritizeBtn = new ButtonBuilder()
            .setCustomId('priority-btn')
            .setLabel('Prioritize')
            .setStyle(ButtonStyle.Primary);
        const prioritizeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(prioritizeBtn);

        const suggestedById = thread.ownerId;
        const suggestionTitle = thread.name;
        const suggestionDescription = await thread.fetchStarterMessage().then((msg) => msg?.content);
        const suggestionType = (thread.parent as ForumChannel).availableTags.filter((item) => thread.appliedTags.includes(item.id)).map((item) => item.name).join(', ') || 'no tags';
        const suggestionUrl = thread.url;
        const threadId = thread.id;
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

        thread.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Notice for ${roleMention(roleId)}. If you would like to prioritize this suggestion, please click the **Prioritize** button.`)
                    .setFooter({ text: suggestion })
                    .setColor('Green')
            ],
            components: [prioritizeRow]
        });
    }

    if (thread.parentId === bugReportParentId) {
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

        const bugReporterId = thread.ownerId;
        const bugReportTitle = thread.name;
        const bugReportDescription = await thread.fetchStarterMessage().then((msg) => msg?.content);
        const bugReportUrl = thread.url;
        const threadId = thread.id;
        const dateReported = Math.floor(Date.now() / 1000);

        const bugReport = await client.utility.core.bugReports.insertBugReportData(
            bugReporterId!,
            bugReportTitle,
            bugReportDescription!,
            bugReportUrl,
            threadId,
            dateReported
        );

        thread.send({
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