import { Component } from "@/Structures/Component";
import { stripIndents } from "common-tags";
import { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonInteraction, 
    ButtonStyle, 
    EmbedBuilder, 
    ForumChannel, 
    TextBasedChannel, 
    userMention 
} from "discord.js";

const bugReportForumChannelId = process.env.ENVIRONMENT === 'dev' ? '1127047439195582524' : '1090931029608509490';
const bugReportListChannelId = process.env.ENVIRONMENT === 'dev' ? '1127053810804719696' : '1126095751496343592';

export default new Component<ButtonInteraction>({
    customId: 'major-bug-btn',
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

        const bugReportId = interaction.message.embeds[0].footer?.text!;
        const bugReportData = await client.utility.core.bugReports.getBugReportData(bugReportId);

        const finishBugBtn = new ButtonBuilder()
            .setCustomId('finish-bug-btn')
            .setLabel('Mark as done')
            .setStyle(ButtonStyle.Primary);
        const finishBugRow = new ActionRowBuilder<ButtonBuilder>().addComponents(finishBugBtn);

        (interaction.guild?.channels.cache.get(bugReportListChannelId) as TextBasedChannel).send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('New major bug report')
                    .setDescription(stripIndents(`
                        **Suggested by:** ${userMention(bugReportData?.bugReporterId!)}

                        **Title:** ${bugReportData?.bugReportTitle}
                        **Description:**
                        ${bugReportData?.bugReportDescription}

                        Jump to bug report: ${bugReportData?.bugReportUrl}
                    `))
                    .setColor('Random')
                    .setFooter({ text: bugReportId })
            ],
            components: [finishBugRow]
        })

        const thread = (interaction.guild?.channels.cache.get(bugReportForumChannelId) as ForumChannel).threads.cache.get(bugReportData?.threadId!);
        await thread?.setName(`[MAJOR BUG] - ${thread.name}`);
        await thread?.setLocked(true);

        response.edit({
            content: 'This bug report has been checked and are now marked as major bug by the Community Directors.',
            embeds: [],
            components: []
        })
    }
})