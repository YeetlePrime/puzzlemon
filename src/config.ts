export const token: string = orDefault(process.env.TOKEN, '');
export const applicationId: string = orDefault(process.env.APPLICATION_ID, '');
export const guildId: string = orDefault(process.env.GUILD_ID, '');
export const dbConfig = {
	user: orDefault(process.env.DB_USER, 'postgres'),
	password: orDefault(process.env.DB_PASSWORD, 'postgres'),
	host: orDefault(process.env.DB_HOST, 'localhost'),
	port: orDefaultNumber(parseInt(process.env.DB_PORT as string), 5432),
	database: orDefault(process.env.DB_DATABASE, 'postgres')
}

function orDefault(value: string | undefined, defaultValue: string): string {
	return typeof value === 'string' ? value as string : defaultValue;
}

function orDefaultNumber(value: number | undefined, defaultValue: number): number {
	return typeof value === 'number' ? value as number : defaultValue;
}
