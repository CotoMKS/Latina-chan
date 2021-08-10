const Discord = require('discord.js')
const { readdirSync } = require("fs");
const { join } = require('path')
require('dotenv').config()

const client = new Discord.Client()
client.commands = new Discord.Collection()
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

client.login(process.env.TOKEN)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity({ name: `Default Prefix ${process.env.PREFIX}`, type: "LISTENING" })
})

client.on('warn', info => console.warn(info))
client.on('error', console.error)

require('./events/guildMemberAdd')(client)
require('./events/guildMemberRemove')(client)

const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(file.split('.')[0], command);
}

client.on("message", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;

    let PREFIX = process.env.PREFIX;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(message, client, args);
    } catch (error) {
        console.error(error);
        message.reply(`Error while executing the command\Reason : ${error}`).catch(console.error);
    }
});