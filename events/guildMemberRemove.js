const { MessageEmbed } = require("discord.js")

module.exports = (client) => {
    client.on('guildMemberRemove', (member) => {
        const channel = member.guild.channels.cache.find(c => c.id === "873470102220206101")
        
        const embed = new MessageEmbed()
            .setTitle(`Sayonara, ${member.user.tag}`)
            .setColor(process.env.EMBED_COLOR)
            .setDescription(`A member has leave the server!`)
            .setThumbnail(member.user.displayAvatarURL({dynamic: true, format: 'png'}))
            .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`)

        channel.send(embed)
    })
}