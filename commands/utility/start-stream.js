const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

const uri = process.env.GATSBY_MONGODB_URL;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start-stream')
		.setDescription('Start stream on Dracoviz homepage')
		.addStringOption(option =>
			option.setName('channel')
				.setDescription('Twitch channel name (do not include twitch.tv)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Title on the homepage')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('link')
				.setDescription('Link to dracoviz page')
				.setRequired(true)),
	async execute(interaction) {
		const currentStream = interaction.options.getString('channel');
		const title = interaction.options.getString('title');
		const link = interaction.options.getString('link');
		if (currentStream == null || currentStream.includes('twitch.tv')) {
			await interaction.reply('Invalid link. Must be a Twitch channel name.');
			return;
		}
		const client = new MongoClient(uri);
		const pokemongo = client.db('pokemongo');
		try {
			const updated = await pokemongo.collection('stream').updateOne({ }, { $set:{
				currentStream,
				title,
				link,
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
