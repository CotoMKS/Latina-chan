const osu = require('node-osu');
const { MessageEmbed } = require('discord.js');
const api = new osu.Api("ec05a5845900cff1b969fa4fd052356e874aa6be", {
    notFoundAsError: true,
    completeScores: true,
    parseNumeric: true
});

module.exports = {
    category: "osu",
    description: "Access osu! API to get a player best performance",
    usage: `${process.env.PREFIX}osu_best [osu username] <0 / 1 / 2 / 3>`,
    async execute(message, client, args) {
        const player = args[0]

        if (!player) return message.channel.send(`**How to use** : \n\`\`\`${PREFIX}osu_best [osu username] <0 / 1 / 2 / 3>\`\`\``);

        if (args[1]) {
            const regExp = /^[]{0,1}[0-3]$/g
            if (!args[1].match(regExp)) return message.channel.send(`**How to use** : \n\`\`\`${PREFIX}osu_best [osu username] <0 / 1 / 2 / 3>\`\`\``);

            return api.getUserBest({ u: player, m: args[1] }).then(res => {
                let mode
                const accuracyPercentage = res[0].accuracy * 100;

                if (args[1] === "0") {
                    mode = "osu!Standard"
                } else if (args[1] === "1") {
                    mode = "osu!Taiko"
                } else if (args[1] === "2") {
                    mode = "osu!CtB"
                } else if (args[1] === "3") {
                    mode = "osu!Mania"
                }

                let modArray = []
                if (res[0].mods !== "") {
                    modArray.push(res[0].mods.filter(m => {
                        return m !== "FreeModAllowed" && m !== "ScoreIncreaseMods"
                    }))
                }

                const embed = new MessageEmbed()
                    .setAuthor(`${player}'s ${mode} Best Performance`, `http://s.ppy.sh/a/${res[0].user.id}`)
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(`${res[0].beatmap.title} [${res[0].beatmap.version}]`)
                    .addField('Rank', res[0].rank, true)
                    .addField('Accuracy', `${accuracyPercentage.toFixed(2)}%`, true)
                    .addField('Score', res[0].score, true)
                    .addField('Performance Points', res[0].pp.toFixed(0), true)
                    .addField('Difficulty Rating', `${res[0].beatmap.difficulty['rating'].toFixed(2)}⭐`)
                    .addField('Detailed Stats', `**Mod Used** : ${modArray}\n\n**Max Combo** : ${res[0].maxCombo}x\n\n**300/100/50/Geki/Katu/Miss Count** : \n\`${res[0].counts['300']}/${res[0].counts["100"]}/${res[0].counts['50']}/${res[0].counts['geki']}/${res[0].counts['katu']}/${res[0].counts['miss']}\``)

                api.getBeatmaps({ b: res[0].beatmapId }).then(beatmaps => {
                    const thisBeatmapSetID = beatmaps[0].beatmapSetId;

                    embed.setURL(`https://osu.ppy.sh/b/${res[0].beatmapId}`)
                    embed.setThumbnail(`https://b.ppy.sh/thumb/${thisBeatmapSetID}l.jpg`)
                    return message.channel.send(embed)
                })
            })
        }

        return api.getUserBest({ u: player }).then(res => {
            const accuracyPercentage = res[0].accuracy * 100;

            let modArray = []
            if (res[0].mods !== "") {
                modArray.push(res[0].mods.filter(m => {
                    return m !== "FreeModAllowed" && m !== "ScoreIncreaseMods"
                }))
            }

            const embed = new MessageEmbed()
                .setAuthor(`${player}'s Best Performance`, `http://s.ppy.sh/a/${res[0].user.id}`)
                .setColor(process.env.EMBED_COLOR)
                .setTitle(`${res[0].beatmap.title} [${res[0].beatmap.version}]`)
                .addField('Rank', res[0].rank, true)
                .addField('Accuracy', `${accuracyPercentage.toFixed(2)}%`, true)
                .addField('Score', res[0].score, true)
                .addField('Performance Points', res[0].pp.toFixed(0), true)
                .addField('Difficulty Rating', `${res[0].beatmap.difficulty['rating'].toFixed(2)}⭐`)
                .addField('Detailed Stats', `**Mod Used** : ${modArray}\n\n**Max Combo** : ${res[0].maxCombo}x\n\n**300/100/50/Geki/Katu/Miss Count** : \n\`${res[0].counts['300']}/${res[0].counts["100"]}/${res[0].counts['50']}/${res[0].counts['geki']}/${res[0].counts['katu']}/${res[0].counts['miss']}\``)

            api.getBeatmaps({ b: res[0].beatmapId }).then(beatmaps => {
                const thisBeatmapSetID = beatmaps[0].beatmapSetId;

                embed.setURL(`https://osu.ppy.sh/b/${res[0].beatmapId}`)
                embed.setThumbnail(`https://b.ppy.sh/thumb/${thisBeatmapSetID}l.jpg`)
                return message.channel.send(embed)
            })
        })
    },
};