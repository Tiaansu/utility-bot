import { Awaitable, ClientEvents } from "discord.js";
import Client from "./Client";

export class Event<K extends keyof ClientEvents> {
    public constructor(
        public name: K,
        public run: (
            client: Client,
            ...args: ClientEvents[K]
        ) => Awaitable<any> | any
    ) {}
}