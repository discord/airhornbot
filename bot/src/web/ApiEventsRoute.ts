import {Request, Response} from "express";
import EventEmitter from "events";
import {getCountForKey, getCountForSetKey} from "../utils/RedisUtils";
import {configSecrets} from "../utils/ConfigurationSecrets";

let counter = 0;

process.setMaxListeners(0);
const eventEmitter: EventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(0);

setInterval(async () => {
  // Get the sum of the total count for every row
  const totalGlobalCount = await getCountForKey(configSecrets.redis.prefix + ":total");
  // Get number of guilds/channels/users where the bot was used
  const totalUniqueUsers = await getCountForSetKey(configSecrets.redis.prefix + ":users");
  const totalUniqueGuilds = await getCountForSetKey(configSecrets.redis.prefix + ":guilds");
  const totalUniqueChannels = await getCountForSetKey(configSecrets.redis.prefix + ":channels");
  // Emit the message of the stats
  eventEmitter.emit("message", {
    id: counter++,
    event: "message",
    data: {
      "total": String(totalGlobalCount),
      "unique_users": String(totalUniqueUsers),
      "unique_guilds": String(totalUniqueGuilds),
      "unique_channels": String(totalUniqueChannels),
      "secret_count": String(0)
    }
  });
}, 1000);

export function apiEventsRouteHandler(req: Request, res: Response): void {
  // Set and flush headers for event stream
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  // Event handler
  const handler = (message: {
    id: number,
    event: string,
    data: unknown
  }) => {
    res.write([
      "id: " + message.id,
      "event: " + message.event,
      "data: " + JSON.stringify(message.data)
    ].join("\n") + "\n\n");
  };

  // When we get the event, send it
  eventEmitter.on("message", handler);

  // If client closes connection, stop sending events
  res.on("close", () => {
    eventEmitter.off("message", handler);
    res.end();
  });
}
