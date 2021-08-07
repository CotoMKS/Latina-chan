const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require('path')

module.exports = {
    category: "general",
    description: "Show list of available commands",
    usage: `${process.env.PREFIX}help`,
    async execute(message, client, args) {
        PREFIX = process.env.PREFIX;

        const commandFiles = readdirSync(__dirname).filter((file) => file.endsWith(".js"));
        commands = []
        for (const file of commandFiles) {
            const command = require(join(__dirname, file));
            commands.push({
                name: file.split('.')[0],
                category: command.category,
                description: command.description,
                usage: command.usage
            })
        }

        let categories = [];
        commands.forEach((c) => {
            if (!categories.includes(c.category)) {
                categories.push(c.category);
            }
        });
        categories.sort();

        if (args[0]) {
            const commandNameToSee = commands.find(
                (command) => command.name == args[0]
            );
            if (!commandNameToSee) {
                return message.channel.send("Unknown Commands");
            } else {
                let detailEmbed = new MessageEmbed()
                    .setTitle(`About \`${PREFIX}${commandNameToSee.name}\` command`)
                    .setColor(process.env.EMBED_COLOR)
                    .setDescription(
                        `**Description** : ${commandNameToSee.description}\nUsage : \`${commandNameToSee.usage}\``
                    )
                    .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`)

                return message.channel.send(detailEmbed);
            }
        }

        let helpEmbed = new MessageEmbed()
            .setTitle("Available Commands :")
            .setDescription(
                `For command detail, type \`${PREFIX}help <command name>\`\n[Join The Development Server](https://discord.gg/hWF4R8XV) | [Invite Me to Your Server](https://discord.com/oauth2/authorize?client_id=857628834374090762&permissions=2081422583&scope=bot)`
            )
            .setColor(process.env.EMBED_COLOR)
            .setFooter(`${process.env.BOT_NAME} by CotoMKS27#9361`)

        for (i = 0; i < categories.length; i++) {
            helpEmbed.addField(
                `❯ **${categories[i].split("_").join(" ").replace(/^\w/, (c) => c.toUpperCase())} Commands**`,
                `${commands
                    .filter((command) => command.category == categories[i])
                    .map((command) => `\`${PREFIX}${command.name}\``)
                    .join(" ")}`
            );
        }

        message.channel.send(helpEmbed).catch(console.error);
    },
};