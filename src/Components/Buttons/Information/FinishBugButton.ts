import { Component } from "@/Structures/Component";
import { 
    ButtonInteraction, 
    EmbedBuilder, 
    ForumChannel
} from "discord.js";

const bugReportForumChannelId = process.env.ENVIRONMENT === 'dev' ? '1127047439195582524' : '1090931029608509490';

export default new Component<ButtonInteraction>({
    customId: 'finish-bug-btn',
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

        const bugReportId = interaction.message.embeds[0].footer?.text!;
        const bugReportData = await client.utility.core.bugReports.getBugReportData(bugReportId);

        const thread = (interaction.guild?.channels.cache.get(bugReportForumChannelId) as ForumChannel).threads.cache.get(bugReportData?.threadId!);

        await thread?.setName(thread.name.replace('[BUG]', '[FIXED]').replace('[MINOR BUG]', '[FIXED]').replace('[MAJOR BUG]', '[FIXED]'));

        await client.utility.core.prisma.bugReports.delete({
            where: { bugReportId }
        });

        response.edit({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Finished fixing bug`)
                    .setDescription(interaction.message.embeds[0].description)
                    .setColor(interaction.message.embeds[0].color)
                    .setFooter(interaction.message.embeds[0].footer)
            ],
            components: []
        });
    }
})
