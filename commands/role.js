const { MessageEmbed } = require("discord.js");

module.exports = {
	category: "moderation",
	description: "Add or Remove Role",
    usage: `${process.env.PREFIX}role [add / remove] [user] [role]`,
	async execute(message, client, args) {
		let PREFIX = process.env.PREFIX;

		const warningPermissionEmbed = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription("Missing the following Permissions\n```MANAGE_ROLES```");

		const warningUsageEmbed = new MessageEmbed()
			.setColor("#fff700")
			.setAuthor("Warning!", client.user.displayAvatarURL({ format: "png", dynamic: true }))
			.setDescription(`**How to use** : \n\`\`\`${PREFIX}role [add / remove] [user] [role]\`\`\``);

		if (!message.member.permissions.has("MANAGE_ROLES")) return message.channel.send(warningPermissionEmbed);

		if (args[0] === "add") {
			let user = message.mentions.users.first();
			if (!user) return message.channel.send(warningUsageEmbed);

			let role = message.mentions.roles.first();
			if (!role) return message.channel.send(warningUsageEmbed);

			let userTarget = message.guild.members.cache.get(user.id);

			const addRoleSuccess = new MessageEmbed().setAuthor(`Successfully give ${role.name} role to ${user.username}`, message.author.displayAvatarURL({ format: "png", dynamic: true })).setColor(process.env.EMBED_COLOR);

			userTarget.roles.add(role.id), message.channel.send(addRoleSuccess);
		} else if (args[0] === "remove") {
			let user = message.mentions.users.first();
			if (!user) return message.channel.send(warningUsageEmbed);

			let role = message.mentions.roles.first();
			if (!role) return message.channel.send(warningUsageEmbed);

			let userTarget = message.guild.members.cache.get(user.id);

			const removeRoleSuccess = new MessageEmbed().setAuthor(`Successfully remove ${role.name} role from ${user.username}`, message.author.displayAvatarURL({ format: "png", dynamic: true })).setColor(process.env.EMBED_COLOR);

			userTarget.roles.remove(role.id), message.channel.send(removeRoleSuccess);
		} else {
			message.channel.send(warningUsageEmbed);
		}
	},
};