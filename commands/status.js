const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const { version } = require("../package.json");
const si = require('systeminformation');

module.exports = {
    category: "info",
    description: "Show bot or server status",
    usage: `${process.env.PREFIX}status [server / bot / user]`,
    async execute(message, client, args) {
        if (!args[0]) {
            message.channel.send(`Usage : \`${process.env.PREFIX}status [server / bot / user]\``)
        } else if (args[0] === "server") {
            const { guild } = message;

            const { name, region, owner } = guild;
            let icon;

            if (guild.icon !== null) {
                icon = guild.icon;
            } else {
                let alphabets = name.split('')
                const placeHolder = `https://via.placeholder.com/512/2C2F33/FFFFFF?text=${alphabets[0]}`
                console.log(alphabets)
                icon = placeHolder;
            }

            const totalMember = guild.members.cache.filter((m) => !m.user.bot).size;
            const totalBots = guild.members.cache.filter((m) => m.user.bot).size;

            const textChannelCount = guild.channels.cache.filter((c) => c.type === "text").size;
            const voiceChannelCount = guild.channels.cache.filter((c) => c.type === "voice").size;

            let rolemap = message.guild.roles.cache
                .sort((a, b) => b.position - a.position)
                .map((r) => r)
                .join(", ");
            if (rolemap.length > 1024) rolemap = "Too many roles to display";
            if (!rolemap) rolemap = "No role";

            var embedInfo = new Discord.MessageEmbed()
                .setAuthor(`About ${name}`, icon)
                .setColor(process.env.EMBED_COLOR)
                .setThumbnail(icon)
                .addField("Server Name", name, true)
                .addField("Server Owner", owner, true)
                .addField("Server Region", region.toUpperCase(), true)
                .addField("Created At", new Date(guild.createdTimestamp).toLocaleDateString(), false)
                .addField("Channels", `${textChannelCount} Text Channels || ${voiceChannelCount} Voice Channels`, false)
                .addField("Members", `${totalMember} Human || ${totalBots} Bots`, false)
                .addField("Roles", rolemap, true)
                .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`);

            message.channel.send(embedInfo);
        } else if (args[0] === "bot") {
            let commands = message.client.commands.array();
            const commandCount = commands.length;

            let days = Math.floor(client.uptime / 86400000);
            let hours = Math.floor(client.uptime / 3600000) % 24;
            let minutes = Math.floor(client.uptime / 60000) % 60;
            let seconds = Math.floor(client.uptime / 1000) % 60;

            var embedInfo = new MessageEmbed()
                .setAuthor("About me", client.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true }))
                .setDescription(
                    `**Number of Servers** : ${client.guilds.cache.size}\n**Number of Users** : ${client.users.cache.size}\n**Number of Commands** : ${commandCount}\n[Join The Development Server](https://discord.gg/73S2UZf2) | [Invite Me to Your Server](https://discord.com/api/oauth2/authorize?client_id=795120514615607356&permissions=2147483639&scope=bot)`
                )
                .setColor(process.env.EMBED_COLOR)
                .addField("Bot Tag", client.user.tag, false)
                .addField("Developer", `<@470140778845569034>`, false)
                .addField("Version", version, true)
                .addField("Programming Language", "Javascript", true)
                .addField("Default Prefix", `\`${process.env.PREFIX}\``, true)
                .addField("Uptime", `\`\`\`${days}d ${hours}h ${minutes}m ${seconds}s\`\`\``, false)
                .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`);

            function bytesToSize(bytes) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return '0 Byte';
                var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
            }

            const bot_cpu = await si.cpu(i => {
                return i
            })
            const bot_memory = await si.mem(i => {
                return i
            })
            const bot_storage = await si.diskLayout(i => {
                return i[0]
            })
            const bot_os = await si.osInfo(i => {
                return i
            })

            embedInfo.addField("Hardware Information",
                `\`\`\`OS : ${bot_os.distro} ${bot_os.arch}\nCPU : ${bot_cpu.manufacturer} ${bot_cpu.brand}\nMemory : ${bytesToSize(bot_memory.total)}\nStorage : ${bytesToSize(bot_storage[0].size)}\`\`\``
            )

            return message.channel.send(embedInfo)
        } else if (args[0] === "user") {
            const { guild, channel } = message;

            const user = message.mentions.users.first() || message.member.user;
            const member = guild.members.cache.get(user.id);

            let userStatus = "Online";
            if (user.presence.status === "dnd") {
                userStatus = "Cannot be disturbed";
            } else if (user.presence.status === "idle") {
                userStatus = "Idle";
            } else if (user.presence.status === "offline") {
                userStatus = "Offline";
            }

            let memberRoles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map((r) => r)
                .join(", ");
            if (memberRoles.length > 1024) memberRoles = "To many roles to display";
            if (!memberRoles) memberRoles = "No roles";

            const embed = new Discord.MessageEmbed()
                .setAuthor(`About ${user.username}`, user.displayAvatarURL())
                .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
                .setColor(process.env.EMBED_COLOR)
                .addField("❯ User Details", `User ID : ${user.id}\nUser Tag : ${user.tag}\nUser Status : ${userStatus}\nCreated At: ${new Date(user.createdTimestamp).toLocaleDateString()}`, true)
                .addField("❯ Member Details", `Nickname : ${member.nickname || "None"}\nJoined At : ${new Date(member.joinedTimestamp).toLocaleDateString()}\nRoles : ${memberRoles}`, true)
                .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`);

            channel.send(embed);
        }
    },
};