import { Component } from "@/Structures/Component";
import { 
    ButtonInteraction, 
    EmbedBuilder, 
    ForumChannel
} from "discord.js";

const bugReportForumChannelId = process.env.ENVIRONMENT === 'dev' ? '1127047439195582524' : '1090931029608509490';

export default new Component<ButtonInteraction>({
    customId: 'close-bug-report-btn',
    run: async (client, interaction) => {
        const thread = (interaction.guild?.channels.cache.get(bugReportForumChannelId) as ForumChannel).threads.cache.get(interaction.channel?.id!);

        const response = await interaction.deferUpdate();
        response.edit({
            components: []
        });

        if (process.env.ENVIRONMENT === 'prod') {
            if (
                (!interaction.guild?.roles.cache.get('934681107247538206')?.members.has(interaction.user.id) && 
                !interaction.guild?.roles.cache.get('955285417006084126')?.members.has(interaction.user.id)) ||
                thread?.ownerId !== interaction.user.id
            ) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription('That button is not for you.').setColor('Red')
                    ],
                    ephemeral: true
                });
                return;
            }
        }

        const bugReportId = interaction.message.embeds[0].footer?.text!;

        await thread?.setName(`[CLOSED] - ${thread.name}`);
        await thread?.setLocked(true);
        await thread?.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`This thread has been locked because this report is already existing, and fix is being implemented.`)
                    .setColor('Red')
            ]
        });

        await client.utility.core.prisma.bugReports.delete({
            where: { bugReportId }
        });
    }
})
