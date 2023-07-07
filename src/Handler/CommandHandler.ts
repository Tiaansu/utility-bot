import { config } from "dotenv";
config();

import { AsciiTable3 } from 'ascii-table3';
import {
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody
} from 'discord.js';
import Client from "@/Structures/Client";
import loadFiles from "@/Utils/FileLoader";
import { StructureImport } from "@/Interfaces/StructureImport";
import { Command } from "@/Structures/Command";
import { SubCommand } from "@/Structures/SubCommand";
import { SubCommandGroup } from "@/Structures/SubCommandGroup";
import { ContextMenu } from "@/Structures/ContextMenu";
import { basename, sep } from "path";
import Logger from "@/Utils/Logger";
import chalk from "chalk";

const table: AsciiTable3 = new AsciiTable3();
table.setTitle('Commands').setTitleAlignCenter();
table.setHeading('Type', 'Folder', 'Name', 'Status').setHeadingAlignCenter();
table.setStyle('unicode-round');

export default async function loadCommands(client: Client): Promise<any> {
    let count = 0;

    client.commands.clear();
    client.subCommands.clear();
    client.subCommandGroups.clear();
    client.contextMenus.clear();

    if (process.env.ENVIRONMENT === 'prod') {
        await client.application?.commands.set([]);
    } else {
        await client.application?.commands.set([], process.env.DEV_GUILD_ID!);
    }

    const commands: (RESTPostAPIApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody)[] = [];
    const files = await loadFiles('Commands');

    for (const file of files) {
        const splits: string[] = file.split(sep);

        try {
            const command = (
                (await import(file)) as StructureImport<Command & SubCommand & SubCommandGroup>
            ).default;

            if (command.subCommand) {
                client.subCommands.set(command.subCommand, command);
                continue;
            }

            if (command.subCommandGroup) {
                client.subCommandGroups.set(command.subCommandGroup, command);
                continue;
            }

            if (process.env.ENVIRONMENT === 'dev' && command.isTest !== true) {
                table.addRow('Slash Command', splits.at(-2), command.data.name, chalk.yellow('reserved'));
                continue;
            }

            commands.push(command.data.toJSON());

            count ++;
            client.commands.set(command.data.name, command);
            table.addRow('Slash Command', splits.at(-2), command.data.name, chalk.green('success'));
        } catch (error) {
            Logger.error(`Failed to import file ${basename(file)}`);
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            table.addRow('Slash Command', splits.at(-2), splits.at(-1), chalk.red('failed'));
        }
    }

    const contextMenus = await loadFiles('Components/ContextMenus');
    for (const file of contextMenus) {
        const splits: string[] = file.split(sep);

        try {
            const command = (
                (await import(file)) as StructureImport<ContextMenu>
            ).default;

            if (process.env.ENVIRONMENT === 'dev' && command.isTest !== true) {
                table.addRow('Context Menu', splits.at(-2), command.data.name, chalk.yellow('reserved'));
                continue;
            }

            commands.push(command.data.toJSON());

            count ++;
            client.contextMenus.set(command.data.name, command);
            table.addRow('Context Menu', splits.at(-2), command.data.name, chalk.green('success'));
        } catch (error) {
            Logger.error(`Failed to import file ${basename(file)}`);
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            table.addRow('Context Menu', splits.at(-2), splits.at(-1), chalk.red('failed'));
        }
    }

    if (process.env.ENVIRONMENT === 'dev') {
        client.application?.commands.set(commands, process.env.DEV_GUILD_ID!);
    } else {
        client.application?.commands.set(commands);
    }

    if (table.rows.length > 0) {
        Logger.info(`\n${table.toString()}`);
    }
    
    return Logger.info(`Loaded ${count} ${count > 1 ? 'commands' : 'command'}.`);
}