import {
    Client as BotClient,
    ActivityType,
    Collection,
    ButtonInteraction,
    StringSelectMenuInteraction
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
            await this.login(
                process.env.ENVIRONMENT === 'dev'
                ? process.env.DEV_BOT_TOKEN
                : process.env.PROD_BOT_TOKEN
            );

            await loadEvents(this);
        } catch (error) {
            error instanceof Error ? Logger.trace(error.stack) : Logger.error(error);
        }
    }
}