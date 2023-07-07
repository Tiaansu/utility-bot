import { AsciiTable3 } from "ascii-table3";
import loadFiles from "@/Utils/FileLoader";
import Client from "@/Structures/Client";
import { StructureImport } from "@/Interfaces/StructureImport";
import { Component } from "@/Structures/Component";
import { MessageComponentInteraction } from "discord.js";
import chalk from "chalk";
import { Modal } from "@/Structures/Modal";
import Logger from "@/Utils/Logger";
import path from "path";

const table: AsciiTable3 = new AsciiTable3();
table.setTitle('Components').setTitleAlignCenter();
table.setHeading('Type', 'Folder', 'Name', 'Status').setHeadingAlignCenter();
table.setStyle('unicode-round');

export default async function loadComponents(client: Client) {
    let count = 0;
    
    client.buttons.clear();
    client.selectMenus.clear();
    client.modals.clear();

    const files = await loadFiles('Components');

    for (const file of files) {
        const splits: string[] = file.split(path.sep);

        try {
            const component = (
                (await import(file)) as StructureImport<Component<MessageComponentInteraction> & Modal>
            ).default;

            console.log(splits.at(-3)?.toLowerCase());

            switch (splits.at(-3)?.toLowerCase()) {
                case 'buttons':
                    if (!component.customId) {
                        table.addRow('Button', splits.at(-2), splits.at(-1), `${chalk.red('failed')} - no custom id`);
                        continue;
                    }

                    client.buttons.set(component.customId, component);
                    table.addRow('Button', splits.at(-2), component.customId, chalk.green('success'));
                    count ++;
                    break;

                case 'selectmenus':
                    if (!component.customId) {
                        table.addRow('Select Menu', splits.at(-2), splits.at(-1), `${chalk.red('failed')} - no custom id`);
                        continue;
                    }

                    client.selectMenus.set(component.customId, component);
                    table.addRow('Select Menu', splits.at(-2), component.customId, chalk.green('success'));
                    count ++;
                    break;

                case 'modal':
                    if (!component.customId) {
                        table.addRow('Modal', splits.at(-2), splits.at(-1), `${chalk.red('failed')} - no custom id`);
                        continue;
                    }

                    client.modals.set(component.customId, component);
                    table.addRow('Modal', splits.at(-2), component.customId, chalk.green('success'));
                    count ++;
                    break;

                case 'contextmenus':
                    // for some weird reasons, commands starts  to disappear
                    // when starting the bot; so we're going to load our context
                    // menu commands to 'CommandHandler.ts'.
                    break;

                default:
                    break;
            }
        } catch (error) {
            Logger.error(`Failed to import file ${path.basename(file)}`);
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            table.addRow(splits.at(-3), splits.at(-2), splits.at(-1), chalk.red('failed'));
        }
    }

    if (table.rows.length > 0) {
        Logger.info(`\n${table.toString()}`);
    }
    
    return Logger.info(`Loaded ${count} ${count > 1 ? 'components' : 'component'}.`);
}