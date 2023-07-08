import {
    Client as BotClient,
    ActivityType,
    Collection,
    ButtonInteraction,
    StringSelectMenuInteraction,
    Routes,
    User,
    ClientEvents,
    Awaitable
} from 'discord.js';
import botIntents from '@/Constants/Intents';
import botPartials from '@/Constants/Partials';
import Logger from '@/Utils/Logger';
import loadEvents from '@/Handler/EventHandler';
import { Command } from './Command';
import { SubCommand } from './SubCommand';
import { SubCommandGroup } from './SubCommandGroup';
import { Component } from './Component';
import { ContextMenu } from './ContextMenu';
import { Modal } from './Modal';

import {
    BugReports,
    PrismaClient,
    Suggestions
} from '@prisma/client';

import Errors from '@/Data/json/Errors.json';
import SuggestionData from '@/Data/json/Suggestions.json';
import BugReportData from '@/Data/json/BugReports.json';
import DevelopersData from '@/Data/json/Devs.json';

import chalk from 'chalk';
export default class Client<
    Ready extends boolean = boolean
> extends BotClient {
    public commands: Collection<string, Command> = new Collection();
    public subCommands: Collection<string, SubCommand> = new Collection();
    public subCommandGroups: Collection<string, SubCommandGroup> = new Collection();
    public buttons: Collection<string, Component<ButtonInteraction>> = new Collection();
    public selectMenus: Collection<string, Component<StringSelectMenuInteraction>> = new Collection();
    public contextMenus: Collection<string, ContextMenu> = new Collection();
    public cooldowns: Collection<string, number> = new Collection();
    public modals: Collection<string, Modal> = new Collection();

    public componentPermissionHandler: Collection<string, string[]> = new Collection();
    
    public constructor() {
        super({
            intents: botIntents,
            partials: botPartials,
            presence: {
                activities: [
                    {
                        name: 'Starting the bot...',
                        type: ActivityType.Playing
                    }
                ]
            }
        });
    }

    public async start() {
        try {
            await this.login(process.env.BOT_TOKEN);

            await loadEvents(this);
        } catch (error) {
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
        }
    }

    public utility = {
        errors: Errors,
        devs: DevelopersData,
        core: {
            rest: this.rest.setToken(process.env.BOT_TOKEN!),
            prisma: new PrismaClient(),
            suggestions: {
                data: SuggestionData,
                getSuggestionData: async (suggestionId: string): Promise<Suggestions | null> => {
                    return await this.utility.core.prisma.suggestions.findUnique({ where: { suggestionId } });
                },
                hasSuggestionData: async (suggestionId: string): Promise<boolean> => {
                    return await this.utility.core.suggestions.getSuggestionData(suggestionId) ? true : false;
                },
                updateSuggestionData: async (suggestionId: string): Promise<number> => {
                    if (await this.utility.core.suggestions.hasSuggestionData(suggestionId)) {
                        const dateCompleted = Math.floor(Date.now() / 1000);
                        await this.utility.core.prisma.suggestions.update({
                            where: { suggestionId },
                            data: { dateCompleted }
                        });
                        return dateCompleted;
                    }

                    return 0;
                },
                insertSuggestionData: async (suggestedById: string, suggestionTitle: string, suggestionDescription: string, suggestionType: string, suggestionUrl: string, threadId: string, dateSuggested: number): Promise<string> => {
                    const suggestion = await this.utility.core.prisma.suggestions.create({
                        data: {
                            suggestedById,
                            suggestionTitle,
                            suggestionDescription,
                            suggestionType,
                            suggestionUrl,
                            threadId,
                            dateSuggested
                        }
                    });
                    Logger.info(`New suggestion from ${chalk.bold.green((await this.utility.core.rest.get(Routes.user(suggestedById)) as User).username)} (${suggestedById}).`);
                    return suggestion.suggestionId;
                }
            },
            bugReports: {
                data: BugReportData,
                getBugReportData: async (bugReportId: string): Promise<BugReports | null> => {
                    return await this.utility.core.prisma.bugReports.findUnique({ where: { bugReportId }});
                },
                hasBugReportData: async (bugReportId: string): Promise<boolean> => {
                    return await this.utility.core.bugReports.getBugReportData(bugReportId) ? true : false;
                },
                updateBugReportData: async (bugReportId: string): Promise<number> => {
                    if (await this.utility.core.bugReports.hasBugReportData(bugReportId)) {
                        const dateResolved = Math.floor(Date.now() / 1000);
                        await this.utility.core.prisma.bugReports.update({
                            where: { bugReportId },
                            data: { dateResolved }
                        });

                        return dateResolved;
                    }

                    return 0;
                },
                insertBugReportData: async (bugReporterId: string, bugReportTitle: string, bugReportDescription: string, bugReportUrl: string, threadId: string, dateReported: number): Promise<string> => {
                    const bugReport = await this.utility.core.prisma.bugReports.create({
                        data: {
                            bugReporterId,
                            bugReportTitle,
                            bugReportDescription,
                            bugReportUrl,
                            threadId,
                            dateReported
                        }
                    });
                    Logger.info(`New bug report from user ${chalk.bold.green((await this.utility.core.rest.get(Routes.user(bugReporterId)) as User).username)} (${bugReporterId}).`);
                    return bugReport.bugReportId;
                }
            }
        }
    }
}