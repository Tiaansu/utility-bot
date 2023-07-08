import { Component } from "@/Structures/Component";
import Logger from "@/Utils/Logger";
import { ButtonInteraction, EmbedBuilder, ForumChannel, TextBasedChannel } from "discord.js";

const bugReportForumChannelId = process.env.ENVIRONMENT === 'dev' ? '1127047439195582524' : '1090931029608509490';
const bugReportListChannelId = process.env.ENVIRONMENT === 'dev' ? '1127053810804719696' : '1126095751496343592';
const bugReportMessageId = process.env.ENVIRONMENT === 'dev' ? '1127064423316586550' : '';

export default new Component<ButtonInteraction>({
    customId: 'bug-btn',
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
        const bugReportListChannel = interaction.guild?.channels.cache.get(bugReportListChannelId) as TextBasedChannel;
        Logger.debug({bugReportListChannel})
        const bugReportMessage = await bugReportListChannel.messages.fetch(bugReportMessageId);
        Logger.debug({bugReportMessage});

        // Logger.debug(bugReportMessage?.content.length);
        // Logger.debug(bugReportMessage?.content.length! + bugReportData?.bugReportUrl.length!);
        // Logger.debug(bugReportMessage?.content.length! + bugReportData?.bugReportUrl.length! < 2000 /* Max message/text length */);
        // if (bugReportMessage?.content.length! + bugReportData?.bugReportUrl.length! < 2000 /* Max message/text length */) {
        //     bugReportMessage?.edit({
        //         content: `${bugReportMessage.content}\n- ${bugReportData?.bugReportUrl}`
        //     });
        // }

        const thread = (interaction.guild?.channels.cache.get(bugReportForumChannelId) as ForumChannel).threads.cache.get(bugReportData?.threadId!);
        await thread?.setName(`[BUG] - ${thread.name}`);
        await thread?.setLocked(true);

        await client.utility.core.prisma.bugReports.delete({
            where: { bugReportId: bugReportId }
        });

        response.edit({
            content: 'This bug report has been checked and are now marked as bug by the Community Directors.',
            embeds: [],
            components: []
        })
    }
})