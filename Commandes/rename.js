const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");
const formatDate = require('dateformat');

module.exports.run = async (client, message, args) => {

    let rolesupport = db.fetch(`rolesupport_${message.guild.id}`);
    if(!message.member.roles.cache.has(role => role.id === rolesupport) && !message.member.hasPermission("ADMINISTRATOR")) {return;}
    if(!message.channel.topic){return;}
    if(message.channel.topic.split(" ")[0] !== 'MCBotV2' || message.channel.topic.split(" ")[1] !== 'Ticket') {return;}
    message.delete();

    if(!args[0]){
        const embed = new Discord.MessageEmbed()
        .setColor(config.color)
        .setDescription(`**Vous devez préciser le nouveau nom du ticket**`)
        return message.channel.send(embed);
    }
    message.channel.setName(args.join(" "));
    const embed = new Discord.MessageEmbed()
    .setColor(config.color)
    .setDescription(`Ticket renommé par ${message.author} : **${args.join(" ")}**`)
    return message.channel.send(embed);
}

module.exports.help = {
    name: "rename",
	aliases: []
}
// Alexmdz77 | 18/04/2021