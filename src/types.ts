import { Snowflake } from 'discord.js';

export interface ServerConfig {
  address: string;
  port: number;
  DiscordChannelID: Snowflake;
}
