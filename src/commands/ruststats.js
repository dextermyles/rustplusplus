
const Builder = require('@discordjs/builders');

const DiscordMessages = require('../discordTools/discordMessages.js');

module.exports = {
	name: 'ruststats',

	getData(client, guildId) {
		return new Builder.SlashCommandBuilder()
			.setName('ruststats')
			.setDescription('Get Player Stats')
			.addStringOption(option => option
				.setName('query')
				.setDescription('Players steam ID')
				.setRequired(true));
	},

	async execute(client, interaction) {
		const guildId = interaction.guildId;
		const instance = client.getInstance(guildId);
		const rustplus = client.rustplusInstances[guildId];
		const verifyId = Math.floor(100000 + Math.random() * 900000);

		client.logInteraction(interaction, verifyId, 'slashCommand');

		if (!await client.validatePermissions(interaction)) 
			return;

		await interaction.deferReply({ ephemeral: true });

		const query = interaction.options.getString('query');

		if (query !== null) {
			const response = await rustplus.getUserStats(query);
			await DiscordMessages.sendRustStatsMessage(interaction, response);
		}
	},
};
