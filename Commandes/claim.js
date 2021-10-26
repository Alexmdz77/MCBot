const Discord = require('discord.js');
const config = require('../config.json');
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

    let rolesupport = db.fetch(`rolesupport_${message.guild.id}`);
    if(!message.member.roles.cache.has(role => role.id === rolesupport) && !message.member.hasPermission("ADMINISTRATOR")) {return;}
    if(!message.channel.topic){return;}
    if(message.channel.topic.split(" ")[0] !== 'Ticket' || message.channel.topic.split(" ")[1] !== 'Ticket') {return;}
    message.delete();

    let logs = db.fetch(`logs_${message.guild.id}`);

    message.channel.send({
		embed: {
			color: config.color,
			title:'Ticket Claimed',
			description:`Votre ticket sera traité par ${message.author}`,
            timestamp: new Date(),
			footer: {
				text: '© 2021 - MCBotV2',
				icon_url: client.user.displayAvatarURL()
			}
		}
	}).then (function (data){
        db.set(`logs_claimed_${data.channel.guild.id}_${data.channel.id}`, message.author.id)
    });

}

module.exports.help = {
    name: "claim",
	aliases: []
}
// Alexmdz77 | 18/04/2021