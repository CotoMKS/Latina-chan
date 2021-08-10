const osu = require('node-osu');
const { MessageEmbed } = require('discord.js');
const api = new osu.Api("ec05a5845900cff1b969fa4fd052356e874aa6be", {
    notFoundAsError: true,
    completeScores: true,
    parseNumeric: true
});

module.exports = {
    category: "osu",
    description: "Access osu! API to get a player profile",
    usage: `${process.env.PREFIX}osu [osu username] <0 / 1 / 2 / 3>`,
    async execute(message, client, args) {
        const player = args[0]

        if (!player) return message.channel.send(`**How to use** : \n\`\`\`${PREFIX}osu [osu username] <0 / 1 / 2 / 3>\`\`\``);

        if (args[1]) {
            const regExp = /^[]{0,1}[0-3]$/g
            if (!args[1].match(regExp)) return message.channel.send(`**How to use** : \n\`\`\`${PREFIX}osu [osu username] <0 / 1 / 2 / 3>\`\`\``);

            return api.getUser({ u: player, m: args[1] }).then(res => {
                let mode

                if (args[1] === "0") {
                    mode = "osu!Standard"
                } else if (args[1] === "1") {
                    mode = "osu!Taiko"
                } else if (args[1] === "2") {
                    mode = "osu!CtB"
                } else if (args[1] === "3") {
                    mode = "osu!Mania"
                }

                const embed = new MessageEmbed()
                    .setAuthor(`${res.name}'s ${mode} Profile`, `http://s.ppy.sh/a/${res.id}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setThumbnail(`http://s.ppy.sh/a/${res.id}`)
                    .addField('Country', `\`${res.country}\``, true)
                    .addField('Level', `\`${res.level.toFixed(0)}\``, true)
                    .addField('Accuracy', `\`${res.accuracyFormatted}\``, true)
                    .addField('Play Count', `\`${res.counts.plays}\``, true)
                    .addField('Play Time', `\`${res.secondsPlayed}\``, true)
                    .addField('Global Rank', `\`#${res.pp.rank}\``, true)
                    .addField('Country Rank', `\`#${res.pp.countryRank}\``, true)
                    .addField('Total Scores', `\`${res.scores.total}\``, true)
                    .addField('Ranked Scores', `\`${res.scores.ranked}\``, true)
                    .addField('Performance Points', `\`${res.pp.raw}\``, true)

                message.channel.send(embed)
            })
        }

        return api.getUser({ u: player }).then(res => {
            const embed = new MessageEmbed()
                .setAuthor(`${res.name}'s Profile`, `http://s.ppy.sh/a/${res.id}`)
                .setColor(process.env.EMBED_COLOR)
                .setThumbnail(`http://s.ppy.sh/a/${res.id}`)
                .addField('Country', `\`${res.country}\``, true)
                .addField('Level', `\`${res.level.toFixed(0)}\``, true)
                .addField('Accuracy', `\`${res.accuracyFormatted}\``, true)
                .addField('Play Count', `\`${res.counts.plays}\``, true)
                .addField('Play Time', `\`${res.secondsPlayed}\``, true)
                .addField('Global Rank', `\`#${res.pp.rank}\``, true)
                .addField('Country Rank', `\`#${res.pp.countryRank}\``, true)
                .addField('Total Scores', `\`${res.scores.total}\``, true)
                .addField('Ranked Scores', `\`${res.scores.ranked}\``, true)
                .addField('Performance Points', `\`${res.pp.raw}\``, true)

            return message.channel.send(embed)
        })
    },
};