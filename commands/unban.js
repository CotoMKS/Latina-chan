const { MessageEmbed } = require("discord.js");

module.exports = {
	category: "moderation",
	description: "Unban banned member",
    usage: `${process.env.PREFIX}unban [user id]`,
	async execute(message, client, args) {

		let PREFIX = process.env.DEFAULT_PREFIX;

		const warningPermissionEmbed = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription("Missing the following Permissions\n```BAN_MEMBERS```");

		const warningUsageEmbed = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription(`**How to use** : \n\`\`\`${PREFIX}unban [user id]\`\`\``);

		const warningOne = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription("This server has no banned user!");

		const warningTwo = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription("This user is not banned from this server!");

		if (!message.member.hasPermission("BAN_MEMBERS")) {
			return message.channel.send(warningPermissionEmbed);
		}

		if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
			return message.channel.send(warningPermissionEmbed);
		}

		let userID = args[0];
		if (!userID) return message.channel.send(warningUsageEmbed);
		message.guild.fetchBans().then(async (bans) => {
			if (bans.size == 0) return message.channel.send(warningOne);
			let bUser = bans.find((b) => b.user.id == userID);
			if (!bUser) return message.channel.send(warningTwo);
			message.guild.members.unban(bUser.user);

			let successfullyembed = new MessageEmbed()
				.setTitle(`${bUser.user.tag} has been unbanned from this server`)
				.setColor(process.env.EMBED_COLOR)
				.setThumbnail(bUser.user.displayAvatarURL({ format: "png", dynamic: true }))
				.setDescription("Do not make the same mistake twice! No more second chance")
				.setTimestamp();

			message.channel.send(successfullyembed);

			let unbannedDM = new MessageEmbed()
				.setTitle(`You are now unbanned from ${message.guild.name}`)
				.setColor(process.env.EMBED_COLOR)
				.setThumbnail(message.guild.iconURL)
				.setDescription(`Looks like the moderator have give you a second chance. Make sure you didn't do the same mistake twice after you re-join **${message.guild.name}**`)
                .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`);
			if (channelData) {
				const starterChannel = channelData.Channel;
				const channel = message.guild.channels.cache.find((channel) => channel.id === starterChannel);

				const inviteLink = await channel.createInvite({
					maxAge: 1000 * 60 * 10,
					maxUse: 1,
				});

				unbannedDM.setDescription(
					`You can join ${message.guild.name} again by using this invite link\n${inviteLink}\nBut remember, if you make the same mistake you'll never get second chance! Also, this link will expired in 10 minutes.`
				);
			}

			bUser.user.send(unbannedDM);
		});
	},
};