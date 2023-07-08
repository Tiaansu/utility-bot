import Client from "@/Structures/Client";
import loadFiles from "@/Utils/FileLoader";
import { AsciiTable3 } from "ascii-table3";
import { StructureImport } from "@/Interfaces/StructureImport";
import { Event } from "@/Structures/Event";
import { ClientEvents } from "discord.js";
import chalk from "chalk";
import Logger from "@/Utils/Logger";

const table: AsciiTable3 = new AsciiTable3();
table.setTitle('Events').setTitleAlignCenter();
table.setHeading('Folder', 'Name', 'Status').setHeadingAlignCenter();
table.setStyle('unicode-round');

export default async function loadEvents(client: Client): Promise<void> {
    let count = 0;

    const files = await loadFiles('Events');

    for (const file of files) {
        const splits: string[] = file.replace(/\\/g, '/').split('/');

        try {
            const event = (
                (await import(file)) as StructureImport<Event<keyof ClientEvents>>
            ).default;

            // @ts-ignore
            client.on(event.name, event.run.bind(null, client));

            count ++;
            table.addRow(splits.at(-2), event.name, chalk.green('success'));
        } catch (error) {
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
            table.addRow(splits.at(-2), splits.at(-1), chalk.red('failed'));
        }
    }

    if (table.rows.length > 0) {
        Logger.info(`\n${table.toString()}`);
    }

    return Logger.info(`Loaded ${count} ${count > 1 ? 'events' : 'event'}.`);
}