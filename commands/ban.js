const { MessageEmbed } = require("discord.js");

module.exports = {
	category: "moderation",
	description: "Ban a member",
    usage: `${process.env.PREFIX}ban [user] [reason]`,
	async execute(message, client, args) {
		const warningPermissionOneEmbed = new MessageEmbed()
			.setColor(process.env.EMBED_COLOR)
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription("You don't have the following Permissions\n```BAN_MEMBERS```");

		const warningPermissionTwoEmbed = new MessageEmbed()
			.setColor(process.env.EMBED_COLOR)
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription("I don't have the following Permissions\n```BAN_MEMBERS```");

		let banned = message.mentions.users.first();
		let reason = args.slice(1).join(" ");

		if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send(warningPermissionOneEmbed);
		if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send(warningPermissionTwoEmbed);
		if (!banned) return message.channel.send(`**How to use** : \n\`\`\`${PREFIX}ban [user] [reason]\`\`\``);
		if (message.author === banned) return message.channel.send("Can't ban yourself!");
		if (!reason) return message.channel.send(`**How to use** : \n\`\`\`${PREFIX}ban [user] [reason]\`\`\``);

		message.guild.members
			.ban(banned, { reason: reason })
			.then(() => {
				let successfullyembed = new MessageEmbed()
					.setTitle(`${banned.tag} has been *Banned* from this Server`)
					.setThumbnail(banned.displayAvatarURL({ format: "png", dynamic: true }))
					.setColor(process.env.EMBED_COLOR)
					.setDescription(`Reason : ${reason}`)
					.setTimestamp();

				message.channel.send(successfullyembed);
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