import {
  Collection,
  CommandInteraction,
  ApplicationCommandOption,
} from 'discord.js';
import { readdirSync } from 'fs';
import { resolve } from 'path';

export class Command {
  public name: string;
  public options: CommandOptions;
  addName(name: string): this {
    this.name = name;
    return this;
  }
  addOptions(options: CommandOptions): this {
    this.options = options;
    return this;
  }
}

export interface CommandOptions {
  description: string;
  options?: ApplicationCommandOption;
  run: (interaction: CommandInteraction) => Promise<void>;
}

export class CommandManager extends Collection<string, CommandOptions> {
  constructor() {
    super();
  }
  add(name: string, options: CommandOptions): this {
    this.set(name, options);
    return this;
  }
  addDir(path: string) {
    const target = resolve(`${__dirname}/${path}`);
    readdirSync(target).forEach((f) => {
      import(`${target}/${f}`).then((a) => this.add(a.name, a.options));
    });
  }
}
