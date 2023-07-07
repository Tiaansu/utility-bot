import { ActivityType, Events } from "discord.js";
import { Event } from "@/Structures/Event";
import Logger from "@/Utils/Logger";
import ms from "ms";
import loadCommands from "@/Handler/CommandHandler";
import loadComponents from "@/Handler/ComponentHandler";

export default new Event(Events.ClientReady, async (client) => {
    if (!client.isReady()) return;

    await loadCommands(client);
    await loadComponents(client);

    function setBotPresence(): void {
        client.user!.setPresence({
            activities: [{
                name: 'Lost Island Roleplay',
                type: ActivityType.Watching
            }]
        })
    }

    setBotPresence();

    setInterval(() => {
        setBotPresence();
    }, ms('15s'));

    Logger.info(`${client.user.tag} is now online.`);
})