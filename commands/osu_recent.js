const osu = require('node-osu');
const { MessageEmbed } = require('discord.js');
const api = new osu.Api("ec05a5845900cff1b969fa4fd052356e874aa6be", {
    notFoundAsError: true,
    completeScores: true,
    parseNumeric: true
});

module.exports = {
    category: "osu",
    description: "Access osu! API to get a player recent performance",
    usage: `${process.env.PREFIX}osu_recent [osu username]`,
    async execute(message, client, args) {
        const player = args[0]

        if (!player) return message.channel.send(`**How to use** : \n\`\`\`${PREFIX}osu_recent [osu username]\`\`\``);

        return api.getUserRecent({ u: player }).then(res => {
            const accuracyPercentage = res[0].accuracy * 100;

            let modArray = []
            if (res[0].mods !== "") {
                modArray.push(res[0].mods.filter(m => {
                    return m !== "FreeModAllowed" && m !== "ScoreIncreaseMods"
                }))
            }

            const embed = new MessageEmbed()
                .setAuthor(`${player}'s Recent Performance`, `http://s.ppy.sh/a/${res[0].user.id}`)
                .setColor(process.env.EMBED_COLOR)
                .setTitle(`${res[0].beatmap.title} [${res[0].beatmap.version}]`)
                .addField('Rank', res[0].rank, true)
                .addField('Accuracy', `${accuracyPercentage.toFixed(2)}%`, true)
                .addField('Score', res[0].score, true)
                .addField('Difficulty Rating', `${res[0].beatmap.difficulty['rating'].toFixed(2)}⭐`)
                .addField('Detailed Stats', `**Mod Used** : ${modArray}\n\n**Max Combo** : ${res[0].maxCombo}x\n\n**300/100/50/Geki/Katu/Miss Count** : \n\`${res[0].counts['300']}/${res[0].counts["100"]}/${res[0].counts['50']}/${res[0].counts['geki']}/${res[0].counts['katu']}/${res[0].counts['miss']}\``)

            api.getBeatmaps({ b: res[0].beatmapId }).then(beatmaps => {
                const thisBeatmapSetID = beatmaps[0].beatmapSetId;

                embed.setURL(`https://osu.ppy.sh/b/${res[0].beatmapId}`)
                embed.setThumbnail(`https://b.ppy.sh/thumb/${thisBeatmapSetID}l.jpg`)
                return message.channel.send(embed)
            }).catch(error => {
                const errorEmbed = new MessageEmbed()
                    .setAuthor('Beatmap not Found!', client.user.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setColor("#fff700")

                return message.channel.send(errorEmbed);
            });
        }).catch(error => {
            const errorEmbed = new MessageEmbed()
                .setAuthor('User not Found', client.user.displayAvatarURL({ format: 'png', dynamic: true }))
                .setColor("#fff700")

            return message.channel.send(errorEmbed);
        });
    },
};