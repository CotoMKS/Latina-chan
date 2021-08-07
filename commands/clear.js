const { MessageEmbed } = require("discord.js");

module.exports = {
	category: "server_management",
	description: "Clear all message from the channel",
    usage: `${process.env.PREFIX}clear`,
	async execute(message, client, args) {
		if (!message.member.permissions.has("MANAGE_MESSAGES")) {
			message.channel.send("You don't have `MANAGE_MESSAGES` Permission");

			return;
		}

		var message_size = 100;
		while (message_size == 100) {
			await message.channel
				.bulkDelete(100)
				.then((messages) => (message_size = messages.size))
				.catch(console.error);
		}

		const clearedEmbed = new MessageEmbed().setAuthor("Channel Cleared!", client.user.displayAvatarURL({ format: "png", dynamic: true })).setColor(process.env.EMBED_COLOR);

		const sent = await message.channel.send(clearedEmbed);
		setTimeout(function () {
			sent.delete();
		}, 1500);
	},
};