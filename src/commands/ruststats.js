
const Builder = require('@discordjs/builders');

const DiscordEmbeds = require('../discordTools/discordEmbeds.js');
const DiscordMessages = require('../discordTools/discordMessages.js');

module.exports = {
	name: 'ruststats',

	getData(client, guildId) {
		return new Builder.SlashCommandBuilder()
			.setName('ruststats')
			.setDescription('Rust Stats by Steam ID')
			.addStringOption(option => option
				.setName('steamId')
				.setDescription('Players steam ID')
				.setRequired(true));
	},

	async execute(client, interaction) {
		const guildId = interaction.guildId;
		const instance = client.getInstance(guildId);
		const rustplus = client.rustplusInstances[guildId];
		const verifyId = Math.floor(100000 + Math.random() * 900000);

		client.logInteraction(interaction, verifyId, 'slashCommand');

		if (!await client.validatePermissions(interaction)) return;
		await interaction.deferReply({ ephemeral: true });

		const steamId = interaction.options.getString('steamId');

		if (steamId !== null) {
			const statsResponse = await rustplus.getUserStats(steamId);
			await DiscordMessages.sendRustStatsMessage(interaction, statsResponse);
		}
	}
};
