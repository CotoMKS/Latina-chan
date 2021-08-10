module.exports = {
    category: "owner",
    description: "Test event and something else",
    usage: `${process.env.PREFIX}test [member_join / member_leave]`,
    async execute(message, client, args) {
        if(message.author.id !== "470140778845569034") return message.channel.send("Only <@470140778845569034> can run this command!")
        if(!args[0]) return message.channel.send(```**How to use** : \n\`\`\`${PREFIX}test [member_join / member_leave]\`\`\``)
    
        if(args[0] === "member_join"){
            client.emit("guildMemberAdd", message.member, {permissions: ['MANAGE_SERVER']})
        }else if(args[0] === "member_leave"){
            client.emit("guildMemberRemove", message.member, {permissions: ['MANAGE_SERVER']})
        }else {
            message.channel.send("Unknown event!")
        }
    }
}