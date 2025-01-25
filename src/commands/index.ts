import { Command } from 'utils.js';

import ping from './ping.js';
import answer from './answer.js';
import info from './info.js';
import clear from './clear.js';
import get from './get.js';
import create from './create.js';
import setLogChannel from './set_log_channel.js';

export const commands: Command[] = [ping, answer, info, clear, get, create, setLogChannel];

