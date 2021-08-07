const { MessageEmbed } = require("discord.js");

module.exports = {
	category: "moderation",
	description: "Give nickname to mentioned user",
    usage: `${process.env.PREFIX}nick [user] [nickname]`,
	async execute(message, client, args) {
		let PREFIX = process.env.PREFIX;
		const warningPermissionEmbed = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription("Missing the following Permissions\n```MANAGE_NICKNAME```");

		const warningUsageEmbed = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription(`**How to use** : \n\`\`\`${PREFIX}nick [user] [nickname]\`\`\``);

		if (!message.member.permissions.has("MANAGE_NICKNAME")) return message.channel.send(warningPermissionEmbed);

		const member = message.mentions.members.first();

		if (!member) return message.channel.send(warningUsageEmbed);

		if (!args.slice(1).join(" ")) return message.channel.send(warningUsageEmbed);

		member
			.setNickname(args.slice(1).join(" "))
			.then(() => {
				const successEmbed = new MessageEmbed().setAuthor(`Successfully change ${member.user.username} nickname to ${args.slice(1).join(" ")}!`, member.user.displayAvatarURL({ format: "png", dynamic: true })).setColor(process.env.EMBED_COLOR);

				message.channel.send(successEmbed);
			})
			.catch((error) => {
				const errorEmbed = new MessageEmbed()
					.setColor("#ff0000")
					.setAuthor("Error!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
					.setTitle("You accidently cause an error!")
					.setDescription(`Please DM this error message to <@470140778845569034>\n\n\`\`\`${error.name}\n${error.stack}\`\`\``)
					.setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`);

				message.channel.send(errorEmbed);
			});
	},
};