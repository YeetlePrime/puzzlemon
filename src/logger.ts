import { WriteStream } from 'tty';
import util from 'util';

const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",

	fg: {
		black: "\x1b[30m",
		red: "\x1b[31m",
		green: "\x1b[32m",
		yellow: "\x1b[33m",
		blue: "\x1b[34m",
		magenta: "\x1b[35m",
		cyan: "\x1b[36m",
		white: "\x1b[37m",
		gray: "\x1b[90m",
		crimson: "\x1b[38m" // Scarlet
	},
	bg: {
		black: "\x1b[40m",
		red: "\x1b[41m",
		green: "\x1b[42m",
		yellow: "\x1b[43m",
		blue: "\x1b[44m",
		magenta: "\x1b[45m",
		cyan: "\x1b[46m",
		white: "\x1b[47m",
		gray: "\x1b[100m",
		crimson: "\x1b[48m"
	}
};

export default {
	info(...args: any[]) {
		this._log(colors.fg.blue, process.stdout, '[INFO]', ...args);
	},
	warn(...args: any[]) {
		this._log(colors.fg.yellow, process.stderr, '[WARN]', ...args);
	},
	error(...args: any[]) {
		this._log(colors.fg.red, process.stderr, '[ERROR]', ...args);
	},
	_log(color: string, stream: WriteStream, ...args: any[]) {
		// Use util.format to handle objects and formatting
		const formattedMessage = args.map(arg =>
			typeof arg === 'object'
				? util.inspect(arg, { depth: null, colors: false }) // Pretty-print objects
				: arg
		).join(' ');

		// Split into lines and apply color
		const messageLines = formattedMessage.split('\n').map(line => `${color}${line}${colors.reset}`);

		// Write the colored output
		stream.write(messageLines.join('\n') + '\n');
	}
}
