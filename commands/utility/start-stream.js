const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

const uri = process.env.GATSBY_MONGODB_URL;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start-stream')
		.setDescription('Start stream on Dracoviz homepage')
		.addStringOption(option =>
			option.setName('link')
				.setDescription('https://www.youtube.com/embed/...')
				.setRequired(true)),
	async execute(interaction) {
		const currentStream = interaction.options.getString('link');
		if (currentStream == null || !currentStream.includes('https://www.youtube.com/embed')) {
			await interaction.reply('Invalid link');
			return;
		}
		const client = new MongoClient(uri);
		const pokemongo = client.db('pokemongo');
		try {
			const updated = await pokemongo.collection('stream').updateOne({ }, { $set:{
				currentStream,
				active: true,
			} });
			if (updated == null) {
				await interaction.reply('The update failed.');
				return;
			}
			await interaction.reply(`Updated with stream link ${currentStream}`);
		}
		catch (e) {
			console.log(e);
			await interaction.reply('Something went wrong during the update.');
		}
	},
};
