const { SlashCommandBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

const uri = process.env.GATSBY_MONGODB_URL;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop-stream')
		.setDescription('Stop stream on Dracoviz homepage'),
	async execute(interaction) {
		const client = new MongoClient(uri);
		const pokemongo = client.db('pokemongo');
		try {
			const updated = await pokemongo.collection('stream').updateOne({ }, { $set:{
				active: false,
			} });
			if (updated == null) {
				await interaction.reply('The update failed.');
				return;
			}
			await interaction.reply('Stream has been turned off');
		}
		catch (e) {
			console.log(e);
			await interaction.reply('Something went wrong during the update.');
		}
	},
};
