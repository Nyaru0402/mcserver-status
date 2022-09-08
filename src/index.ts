import { Client } from './client';
import { ApplicationCommandOption, TextChannel } from 'discord.js';
import { statusLegacy } from 'minecraft-server-util';

import { ServerConfig } from './types';
import servers from './servers.json';

const client = new Client();

client.once('ready', async () => {
  const commands = [...client.commandManager.keys()].map((key: string) => {
    return {
      name: key,
      description: client.commandManager.get(key)?.description as string,
      options: client.commandManager.get(key)
        ?.options as ApplicationCommandOption[],
    };
  });

  await client.application?.commands.set(commands);
  await client.start();

  setInterval(() => {
    servers.forEach((server: ServerConfig) => {
      const channel = client.channels.cache.get(
        server.DiscordChannelID
      ) as TextChannel;

      statusLegacy(server.address, server.port, {
        timeout: 10 * 1000,
        enableSRV: true,
      })
        .then((result) => {
          const { version, players, motd, srvRecord } = result;

          channel?.setTopic(
            `🟢 ${players.online}/${players.max} players online | version : ${version?.name} | Last update : ${new Date().toString()}`
          );
        })
        .catch((error) => {
          channel?.setTopic(`🔴 ${error}`);
        });
    });
  }, 60 * 10 * 1000);
});

client.on('messageCreate', (message) => {});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
