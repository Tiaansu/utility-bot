import { CacheType, EmbedBuilder, Events, Interaction, time } from "discord.js";
import { Event } from "@/Structures/Event";
import chalk from "chalk";
import Logger from "@/Utils/Logger";
import Client from "@/Structures/Client";

export default new Event(Events.InteractionCreate, async (client: Client, interaction: Interaction<CacheType>) => {
    if (!client.isReady()) return;

    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        const cooldown = client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`);

        if (command?.cooldown && cooldown) {
            if (Date.now() < cooldown) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Please slow down.')
                            .setDescription(`You'll be able to use this command again ${time(Math.floor(cooldown / 1000), 'R')}`)
                            .setColor('Red')
                    ],
                    ephemeral: true
                });
            }
            return;
        } else if (command?.cooldown && !cooldown) {
            client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown);

            setTimeout(() => {
                client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`);
            }, command.cooldown);
        }

        const subCommand: string | null = interaction.options.getSubcommand(false);
        const subCommandGroup: string | null = interaction.options.getSubcommandGroup(false);
        if (subCommandGroup) {
            const subCommandGroupFile = subCommand ? client.subCommandGroups.get(`${interaction.commandName}.${subCommandGroup}.${subCommand}`) : client.subCommandGroups.get(`${interaction.commandName}.${subCommandGroup}`);
            const whatCommand = subCommand ? `${interaction.commandName} ${subCommandGroup} ${subCommand}` : `${interaction.commandName} ${subCommandGroup}`;

            if (!subCommandGroupFile) return;

            try {
                Logger.info(`${chalk.bold(interaction.user.tag)} has used ${chalk.yellow(whatCommand)} on ${chalk.bold(interaction.guild ? `${interaction.guild.name} (${interaction.guild.id})` : 'Direct Message (DM)')}.`);
                return subCommandGroupFile.run(client, interaction);
            } catch (error) {
                error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            }
        } else if (subCommand) {
            const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
            const whatCommand = `${interaction.commandName} ${subCommand}`;

            if (!subCommandFile) return;

            try {
                Logger.info(`${chalk.bold(interaction.user.tag)} has used ${chalk.yellow(whatCommand)} on ${chalk.bold(interaction.guild ? `${interaction.guild.name} (${interaction.guild.id})` : 'Direct Message (DM)')}.`);
                return subCommandFile.run(client, interaction);
            } catch (error) {
                error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            }
        } else {
            try {
                Logger.info(`${chalk.bold(interaction.user.tag)} has used ${chalk.yellow(interaction.commandName)} on ${chalk.bold(interaction.guild ? `${interaction.guild.name} (${interaction.guild.id})` : 'Direct Message (DM)')}.`);
                return command?.run!(client, interaction);
            } catch (error) {
                error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            }
        }
    } else if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        const componentPermissionHandler = client.componentPermissionHandler.get(interaction.customId);
        const isComponentCollector: boolean = interaction.customId.split('-').includes('collector');

        if (isComponentCollector) return;

        if (!button) return;

        if (componentPermissionHandler && !componentPermissionHandler.includes(interaction.user.id)) {
            try {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(client.utility.errors.notComponentError.replace(/{{COMPONENT_TYPE}}/g, 'button'))
                            .setColor('Red')
                    ],
                    ephemeral: true
                });
            } catch (error) {
                error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            }
        }

        try {
            await button.run(client, interaction);
        } catch (error) {
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
        }
    } else if (interaction.isStringSelectMenu()) {
        const menu = client.selectMenus.get(interaction.customId);
        const componentPermissionHandler = client.componentPermissionHandler.get(interaction.customId);
        const isComponentCollector: boolean = interaction.customId.split('-').includes('collector');

        if (isComponentCollector) return;

        if (!menu) return;

        if (componentPermissionHandler && !componentPermissionHandler.includes(interaction.user.id)) {
            try {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(client.utility.errors.notComponentError.replace(/{{COMPONENT_TYPE}}/g, 'select menu'))
                            .setColor('Red')
                    ],
                    ephemeral: true
                });
            } catch (error) {
                error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            }
        }

        try {
            await menu.run(client, interaction);
        } catch (error) {
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
        }
    } else if (interaction.isAutocomplete()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;
        if (!command.autocomplete) return;

        try {
            command.autocomplete(client, interaction);
        } catch (error) {
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
        }
    } else if (interaction.isModalSubmit()) {
        const modal = client.modals.get(interaction.customId);

        if (!modal) return;

        try {
            modal.run(client, interaction);
        } catch (error) {
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
        }
    }
});