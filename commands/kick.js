const { MessageEmbed } = require("discord.js");

module.exports = {
	category: "moderation",
	description: "Kick a member",
    usage: `${process.env.PREFIX}kick [user] [reason]`,
	async execute(message, client, args) {
		let PREFIX = process.env.DEFAULT_PREFIX;

		const warningPermissionEmbed = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription("Missing the following Permissions\n```KICK_MEMBERS```");

		const warningUsageEmbed = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription(`**How to use** : \n\`\`\`${PREFIX}kick [user] [reason]\`\`\``);

		const user = message.mentions.users.first();

		if (!user) return message.channel.send(warningUsageEmbed);
		if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(warningPermissionEmbed);
		let target = message.member.guild.member(user);

		if (target) {
			target
				.kick("You've been kick from this server")
				.then(() => {
					let kickEmbed = new MessageEmbed()
						.setAuthor("Member kick", message.author.displayAvatarURL({ format: "png", dynamic: true }))
						.setColor(process.env.EMBED_COLOR)
						.setThumbnail(target.user.displayAvatarURL({ format: "png", dynamic: true }))
						.setDescription(`${message.author.username} has kicked ${target.user.username} from this server`)
						.setTimestamp();

					message.channel.send(kickEmbed);
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
		} else {
			message.channel.send(warningUsageEmbed);
		}
	},
};