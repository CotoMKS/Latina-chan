const { MessageEmbed } = require("discord.js")

module.exports = (client) => {
    client.on('guildMemberAdd', (member) => {
        const role = member.guild.roles.cache.find(r => r.id === "873479051875086366")
        const channel = member.guild.channels.cache.find(c => c.id === "873470102220206101")
        
        const embed = new MessageEmbed()
            .setTitle(`Irrasshai, goshujin-sama`)
            .setColor(process.env.EMBED_COLOR)
            .setDescription(`Welcome to ${member.guild.name}!`)
            .setThumbnail(member.user.displayAvatarURL({dynamic: true, format: 'png'}))
            .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`)

        channel.send(embed)
        member.roles.add(role.id)
    })
}