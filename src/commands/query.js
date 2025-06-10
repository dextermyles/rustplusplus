
const Builder = require('@discordjs/builders');

const DiscordMessages = require('../discordTools/discordMessages.js');

module.exports = {
	name: 'query',
	getData(client, guildId) {
		try {
			return new Builder.SlashCommandBuilder()
				.setName('query')
				.setDescription('Run custom queries (player stats, rust+, etc).')
				.addSubcommand(subcommand => subcommand
					.setName('ban')
					.setDescription('Check if Steam ID has any bans on record.')
					.addStringOption(option => option
						.setName('id')
						.setDescription('Players Steam ID.')
						.setRequired(true)))
				.addSubcommand(subcommand => subcommand
					.setName('stats')
					.setDescription('Rust Stats for Player.')
					.addStringOption(option => option
						.setName('id')
						.setDescription('Players Steam ID.')
						.setRequired(true)))
				.addSubcommand(subcommand => subcommand
					.setName('achievements')
					.setDescription('Rust Achievements for Player.')
					.addStringOption(option => option
						.setName('id')
						.setDescription('Players Steam ID.')
						.setRequired(true)))
				.addSubcommand(subcommand => subcommand
					.setName('profile')
					.setDescription('Rust Profile for Player.')
					.addStringOption(option => option
						.setName('id')
						.setDescription('Players Steam ID.')
						.setRequired(true)))
				.addSubcommand(subcommand => subcommand
					.setName('playtime')
					.setDescription('Rust Play Time for Player.')
					.addStringOption(option => option
						.setName('id')
						.setDescription('Players Steam ID.')
						.setRequired(true)))
				.addSubcommand(subcommand => subcommand
					.setName('entity')
					.setDescription('Test Rust+ sendRequest features.')
					.addStringOption(option => option
						.setName('id')
						.setDescription('Entity ID')
						.setRequired(true)));

		}
		catch (e) {
			console.error(e);
		}
	},

	async execute(client, interaction) {
		const guildId = interaction.guildId;
		const rustplus = client.rustplusInstances[guildId];
		const verifyId = Math.floor(100000 + Math.random() * 900000);

		client.logInteraction(interaction, verifyId, 'slashCommand');

		if (!await client.validatePermissions(interaction))
			return;

		await interaction.deferReply({ ephemeral: true });

		console.log(JSON.stringify(interaction.options));

		const playerId = interaction.options.getString('id');
		var response = '';

		if (!playerId) {
			throw new Error('PlayerID is null');
		}
			
		var subCommand = interaction.options.getSubcommand();
		console.log('subCommand: ', subCommand);
		
		switch (interaction.options.getSubcommand()) {
			case 'ban':
				response = await rustplus.getUserBanned(playerId);
				break;
			case 'stats':
				response = await rustplus.getUserStats(playerId);
				break;
			case 'achivements':
				response = await rustplus.getUserAchievements(playerId);
				break;
			case 'profile':
				response = await rustplus.getUserProfile(playerId);
				break;
			case 'playtime':
				response = await rustplus.getUserPlaytime(playerId);
				break;
			case 'entity':
				var entityId = playerId;
				response = await rustplus.getEntityInfoAsync(entityId, 30000);
				break;
			default:
				break;
		}

		await DiscordMessages.sendRustStatsMessage(interaction, response);
	},
};
