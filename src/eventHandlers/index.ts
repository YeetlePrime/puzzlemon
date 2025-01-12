import { Events } from 'discord.js';
import { type ClientEventHandler, type InteractionEventHandler } from 'utils.js';

import ready from './ready.js';
import slashCommands from './slashCommands.js'

export const interactionEventHandlers: InteractionEventHandler[] = [slashCommands];
export const clientEventHandlers: ClientEventHandler<Events.ClientReady>[] = [ready];
