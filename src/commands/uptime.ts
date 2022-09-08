import { Command } from '../commandManager';
import { Snowflake } from 'discord.js';
import { ServerConfig } from '../types';
import serverconfs from '../servers.json';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { statusLegacy } from 'minecraft-server-util';

let servers: ServerConfig[] = serverconfs as ServerConfig[];

export const { name, options } = new Command().addName('uptime').addOptions({
  description: 'Setup target MCServer',
  options: [
    {
      type: 3,
      name: 'address',
      description: 'The address for mcserver',
      required: true,
    },
    {
      type: 3,
      name: 'port',
      description: "The port for mcserver's address",
      required: true,
    },
  ],
  run: async (interaction) => {
    await interaction.deferReply();
    const server: ServerConfig | undefined = servers.find(
      (s: ServerConfig) => s.DiscordChannelID === interaction.channelId
    );
    const arg = (name: string) =>
      interaction.options.data.find((data) => data.name === name);
    const address: string = String(arg('address')?.value);
    const port: number = Number(arg('port')?.value);

    if (!server) {
      servers.push({
        address,
        port,
        DiscordChannelID: interaction.channelId as Snowflake,
      });
    } else {
      servers
        .filter((s: ServerConfig) => s.address !== server.address)
        .push({
          address,
          port,
          DiscordChannelID: interaction.channelId as Snowflake,
        });
    }
    writeFileSync(join(__dirname, '../servers.json'), JSON.stringify(servers));
    statusLegacy(address, port, { enableSRV: true })
      .then(async (res) => {
        await interaction.editReply(
          `The server info has been updated\naddress: ${address}\nport: ${port}\nversion: ${res.version?.name}\nplayers: ${res.players.online}/${res.players.max}`
        );
      })
      .catch(
        async () =>
          await interaction.editReply('サーバー情報の更新に失敗しました')
      );
  },
});
