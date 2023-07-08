import type { Awaitable, ClientEvents } from 'discord.js';
import type Client from './Client';

export class Event<K extends keyof ClientEvents> {
    public constructor(
        public name: K,
        public run: (
            client: Client,
            ...data: ClientEvents[K]
        ) => Promise<any> | any
    ) {}
}