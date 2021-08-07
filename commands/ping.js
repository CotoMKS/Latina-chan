const { MessageEmbed } = require("discord.js");

const pong = "https://i.imgur.com/PzsssfR.gif";

module.exports = {
    category: "general",
    description: "Ping to Discord API",
    usage: `${process.env.PREFIX}ping`,
    async execute(message, client, args) {

        const pingEmbed = new MessageEmbed()
            .setTitle(":ping_pong: Pong!")
            .setDescription(`• Latency : ${Math.round(message.client.ws.ping)}ms`)
            .setColor(process.env.EMBED_COLOR)
            .setThumbnail(pong)
            .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`);

        message.channel.send(pingEmbed);
    },
};